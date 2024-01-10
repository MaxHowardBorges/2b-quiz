import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from '../entity/question.entity';
import { IsNull, Repository } from 'typeorm';
import { Answer } from '../entity/answer.entity';
import { Questionnary } from '../../questionnary/entity/questionnary.entity';
import { Tag } from '../entity/tag.entity';

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

  async createTag(description: string) {
    const tag = new Tag();
    console.log(description);
    tag.description = description;
    //console.log(tag.idTag);
    console.log(tag);
    await this.tagRepository.save(tag);
  }
  async updateTag(id: number, newDescription: string) {
    const tag = await this.tagRepository.findOne({ where: { idTag: id } });
    if (tag) {
      console.log(newDescription);
      tag.description = newDescription;
      console.log(tag.idTag);
      console.log(tag.description);
      await this.tagRepository.save(tag);
    }
  }

  async deleteTag(id: number) {
    const tag = await this.tagRepository.findOne({ where: { idTag: id } });
    if (tag) {
      await this.tagRepository.delete({ idTag: id });
    }
  }

  async getTag(id: number) {
    const tag = await this.tagRepository.findOneBy({
      idTag: id,
    });
    if (tag) {
      return tag;
    }
  }

  async getTags() {
    return await this.tagRepository.find();
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
    question.idAuthor = q.idAuthor;
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
    return question;
  }

  async deleteQuestions(questionnary: Questionnary) {
    const questions = await this.questionRepository.find({
      where: { questionnary },
    });
    if (!!questions) {
      for (const question of questions) {
        await this.answerRepository.delete({ question });
      }
      await this.questionRepository.delete({ questionnary });
    }
    return !!questions;
  }

  async findQuestion(idQuestion: number) {
    return await this.questionRepository.findOne({
      where: { id: idQuestion },
      relations: ['answers'],
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
      where: { questionnary },
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
      where: { questionnary, id: idQuestion },
    });
    if (question) {
      await this.answerRepository.delete({ question });
      await this.questionRepository.delete({ questionnary, id: idQuestion });
    }
    return !!question;
  }

  async modifyQuestion(
    question: Question,
    questionnary: Questionnary,
    idQuestion: number,
  ) {
    const questionDB = await this.questionRepository.findOne({
      where: { questionnary, id: idQuestion },
      relations: ['answers'],
    });

    if (questionDB) {
      let { id, ...questionWithoutId } = question;
      const newQuestion: Question = Object.assign(
        {},
        questionDB,
        questionWithoutId,
      );
      await this.answerRepository.delete({ question: questionDB });
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

  async getQuestionPrivateBank(
    idUser: number = 111111, //TODO implement User
  ) {
    return await this.questionRepository.find({
      where: { idAuthor: idUser, originalId: IsNull() },
      relations: ['answers', 'questionnary'],
    });
  }
}
