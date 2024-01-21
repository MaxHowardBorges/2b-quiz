import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from '../entity/question.entity';
import { IsNull, Repository } from 'typeorm';
import { Answer } from '../entity/answer.entity';
import { Questionnary } from '../../questionnary/entity/questionnary.entity';
import { Tag } from '../entity/tag.entity';
import { TagDto } from '../dto/tag.dto';
import { Teacher } from '../../user/entity/teacher.entity';
import { QuestionCreateDto } from '../dto/questionCreate.dto';
import { AnswerCreateDto } from '../dto/answerCreate.dto';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    @InjectRepository(Answer)
    private readonly answerRepository: Repository<Answer>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async createTag(teacher: Teacher, tagDto: TagDto) {
    const tag = new Tag();
    tag.description = tagDto.description;
    tag.author = teacher;
    tag.questions = [];
    await this.tagRepository.save(tag);
    return tag;
  }
  async updateTag(id: number, newTag: TagDto) {
    const tag = await this.tagRepository.findOne({ where: { idTag: id } });
    if (tag) {
      tag.description = newTag.description;
      await this.tagRepository.save(tag);
    }
    return !!tag;
  }

  async deleteTag(id: number) {
    const tag = await this.tagRepository.findOne({
      where: { idTag: id },
      relations: ['questions', 'author'],
    });
    if (tag) {
      for (let question of tag.questions) {
        question = await this.findQuestion(question.id);
        question.tags = question.tags.filter(
          (questionTag) => questionTag.idTag !== tag.idTag,
        );
        await this.questionRepository.save(question);
      }

      await this.tagRepository.delete({ idTag: tag.idTag });
    }
    return !!tag;
  }

  async getTag(id: number) {
    const tag = await this.tagRepository.findOneBy({
      idTag: id,
    });
    if (tag) {
      return tag;
    }
  }

  async getTags(teacher: Teacher) {
    return await this.tagRepository.find({
      where: { author: { id: teacher.id } },
      relations: ['questions'],
    });
  }

  async checkQuestionContainingAnswer(question: Question, idAnswer: number) {
    const answer = await this.answerRepository.findOne({
      where: { id: idAnswer },
      relations: ['question'],
    });
    return answer.question.id === question.id;
  }

  async createQuestion(q: Question, questionnary: Questionnary) {
    const question = new Question();
    question.questionnary = questionnary;
    question.content = q.content;
    question.type = q.type;
    question.author = q.author;
    question.originalId = q.originalId;
    if (q.type == 'ouv') {
      q.answers = [];
    }

    await this.questionRepository.save(question);
    for (const a of q.answers) {
      const answer = new Answer();
      answer.content = a.content;
      answer.isCorrect = a.isCorrect;
      answer.question = question;
      await this.answerRepository.save(answer);
    }

    for (const t of q.tags) {
      const tag = await this.getTag(t.idTag);
      if (!tag.questions.some((q) => q.id === question.id)) {
        tag.questions.push(question);
      }
      await this.tagRepository.save(tag);
    }
    return question;
  }

  async deleteQuestions(questionnary: Questionnary) {
    const questions = await this.questionRepository.find({
      where: { questionnary: { id: questionnary.id } },
    });
    if (!!questions) {
      for (const question of questions) {
        await this.answerRepository.delete({ question: { id: question.id } });
      }
      await this.questionRepository.delete({
        questionnary: { id: questionnary.id },
      });
    }
    return !!questions;
  }

  async findQuestion(idQuestion: number) {
    return await this.questionRepository.findOne({
      where: { id: idQuestion },
      relations: ['answers', 'tags'],
    });
  }

  async modifyQuestionsOriginalId(idOriginal: number) {
    const questions = await this.questionRepository.find({
      where: { originalId: idOriginal },
    });
    if (questions.length > 0) {
      questions[0].originalId = null;
      await this.questionRepository.save(questions[0]);
      const newId = questions[0].id;
      if (questions.length > 1) {
        for (let i = 1; i < questions.length; i++) {
          questions[i].originalId = newId;
          await this.questionRepository.save(questions[i]);
        }
      }
    }
  }

  async findQuestions(questionnary: Questionnary) {
    return await this.questionRepository.find({
      where: { questionnary: { id: questionnary.id } },
      relations: ['tags'],
    });
  }

  async findAnswers(idQuestion: number) {
    const questionsDB = await this.questionRepository.findOne({
      where: { id: idQuestion },
      relations: ['answers'],
    });
    return questionsDB.answers.map((answerEnt) => {
      const answer = new Answer();
      answer.id = answerEnt.id;
      answer.content = answerEnt.content;
      answer.isCorrect = answerEnt.isCorrect;
      answer.question = null;
      return answer;
    });
  }

  async deleteQuestion(questionnary: Questionnary, idQuestion: number) {
    const question = await this.questionRepository.findOne({
      where: { questionnary: { id: questionnary.id }, id: idQuestion },
    });
    if (question) {
      await this.answerRepository.delete({ question: { id: question.id } });
      await this.questionRepository.delete({
        questionnary: { id: questionnary.id },
        id: idQuestion,
      });
    }
    return !!question;
  }

  async modifyQuestion(
    question: Question,
    questionnary: Questionnary,
    idQuestion: number,
  ) {
    const questionDB = await this.questionRepository.findOne({
      where: { questionnary: { id: questionnary.id }, id: idQuestion },
      relations: ['answers', 'tags'],
    });

    if (questionDB) {
      const { id, ...questionWithoutId } = question;
      const newQuestion: Question = Object.assign(
        {},
        questionDB,
        questionWithoutId,
      );
      await this.answerRepository.delete({ question: { id: questionDB.id } });
      await this.questionRepository.save(newQuestion);

      for (const a of question.answers) {
        const answer = new Answer();
        answer.content = a.content;
        answer.isCorrect = a.isCorrect;
        answer.question = newQuestion;
        await this.answerRepository.save(answer);
      }
    }

    return !!questionDB;
  }

  async getQuestionPrivateBank(teacher: Teacher) {
    return await this.questionRepository.find({
      where: { author: { id: teacher.id }, originalId: IsNull() },
      relations: ['answers', 'questionnary', 'tags'],
    });
  }

  async questionExists(idQuestion: number) {
    return !!(await this.findQuestion(idQuestion));
  }

  async tagExists(idTag: number) {
    return !!(await this.getTag(idTag));
  }

  async isQuestionFromTeacher(idQuestion: number, teacher: Teacher) {
    const question = await this.findOneQuestion(idQuestion, ['author']);
    return question.author.id === teacher.id;
  }

  async findOneQuestion(idQuestion: number, relations: string[]) {
    return await this.questionRepository.findOne({
      where: { id: idQuestion },
      relations: relations,
    });
  }

  async isTagFromTeacher(idTag: number, teacher: Teacher) {
    const tag = await this.findOneTag(idTag, ['author']);
    return tag.author.id === teacher.id;
  }

  async findOneTag(idTag: number, relations: string[]) {
    return await this.tagRepository.findOne({
      where: { idTag: idTag },
      relations: relations,
    });
  }

  dtoToQuestion(
    questionDto: QuestionCreateDto,
    questionnaryRef: Questionnary,
  ): Question {
    const question = new Question();
    question.id = null;
    question.content = questionDto.content;
    question.answers = [];
    question.questionnary = questionnaryRef;
    question.type = questionDto.type;
    question.originalId = questionDto.id !== undefined ? questionDto.id : null;
    question.tags = [];
    for (const tagDto of questionDto.tags) {
      question.tags.push(this.dtoToTag(tagDto));
    }
    for (const answerDto of questionDto.answers) {
      question.answers.push(this.dtoToAnswer(answerDto, question));
    }
    return question;
  }
  dtoToAnswer(answerDto: AnswerCreateDto, questionRef: Question) {
    const answer = new Answer();
    answer.id = null;
    answer.content = answerDto.content;
    answer.isCorrect = answerDto.isCorrect;
    answer.question = questionRef;
    return answer;
  }

  dtoToTag(tagDto: TagDto) {
    const tag = new Tag();
    tag.idTag = tagDto.idTag;
    tag.description = tagDto.description;
    return tag;
  }
}
