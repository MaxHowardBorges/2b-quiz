import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from '../entity/question.entity';
import { Repository } from 'typeorm';
import { Answer } from '../entity/answer.entity';
import { QuestionDto } from '../dto/question.dto';
import { QuestionCreateDto } from '../dto/questionCreate.dto';
import { AnswerDto } from '../dto/answer.dto';
import { Questionnary } from '../../questionnary/entity/questionnary.entity';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    @InjectRepository(Answer)
    private readonly answerRepository: Repository<Answer>,
  ) {}

  async findAll(): Promise<Question[]> {
    return this.questionRepository.find();
  }

  async findAllWithQuestion(): Promise<Question[]> {
    return this.questionRepository.find({ relations: ['answers'] });
  }

  async checkQuestionContainingAnswer(question: Question, idAnswer: number) {
    const answer = await this.answerRepository.findOne({
      where: { id: idAnswer },
      relations: ['question'],
    });
    return answer.question.id === question.id;
  }

  async findOne(idQuestion: number): Promise<Question> {
    return this.questionRepository.findOne({ where: { id: idQuestion } });
  }

  async createQuestion(q: QuestionCreateDto, questionnary : Questionnary) {
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

  async deleteQuestions(questionnary : Questionnary) {
    const questions = await this.questionRepository.find({
      where: { questionnary },
    });
    for (const question of questions) {
      await this.answerRepository.delete({ question });
    }
    await this.questionRepository.delete({ questionnary });
  }

  async findQuestion(questionnary : Questionnary) {
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

  async deleteQuestion(questionnary : Questionnary, idQuestion: number) {
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
    questionnary : Questionnary,
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
