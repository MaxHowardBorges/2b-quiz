import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from '../entity/question.entity';
import { Repository } from 'typeorm';
import { Answer } from '../entity/answer.entity';
import { QuestionDto } from '../dto/question.dto';
import { QuestionCreateDto } from '../dto/questionCreate.dto';
import { AnswerDto } from '../dto/answer.dto';
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

  async checkQuestionContainingAnswer(question: QuestionDto, idAnswer: number) {
    const answer = await this.answerRepository.findOne({
      where: { id: idAnswer },
      relations: ['question'],
    });
    return answer.question.id === question.id;
  }

  async createQuestion(q: QuestionCreateDto, questionnary: Questionnary) {
    const question = new Question();
    question.questionnary = questionnary;
    question.content = q.content;

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
    for (const question of questions) {
      await this.answerRepository.delete({ question });
    }
    await this.questionRepository.delete({ questionnary });
  }

  async findQuestion(questionnary: Questionnary) {
    const questions = await this.questionRepository.find({
      where: { questionnary },
      relations: ['answers'],
    });

    const questionDtos: QuestionDto[] = [];
    for (const question of questions) {
      const answerDtos = question.answers.map((answerEnt) => {
        const answerDto = new AnswerDto();
        answerDto.id = answerEnt.id;
        answerDto.content = answerEnt.content;
        answerDto.isCorrect = answerEnt.isCorrect;
        return answerDto;
      });

      const questionDto = {
        id: question.id,
        content: question.content,
        answers: answerDtos,
      };

      questionDtos.push(questionDto);
    }

    return questionDtos;
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
    questionDto: QuestionCreateDto,
    questionnary: Questionnary,
    idQuestion: number,
  ) {
    const question = await this.questionRepository.findOne({
      where: { questionnary, id: idQuestion },
      relations: ['answers'],
    });

    if (question) {
      Object.assign(question, questionDto);
      await this.answerRepository.delete({ question });
      await this.questionRepository.save(question);

      for (const a of questionDto.answers) {
        const answer = new Answer();
        answer.content = a.content;
        answer.isCorrect = a.isCorrect;
        answer.question = question;
        await this.answerRepository.save(answer);
      }
    }

    return !!question;
  }
}
