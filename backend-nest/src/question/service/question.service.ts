import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from '../entity/question.entity';
import { Repository } from 'typeorm';
import { Answer } from '../entity/answer.entity';
import { Questionnary } from '../../questionnary/entity/questionnary.entity';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    @InjectRepository(Answer)
    private readonly answerRepository: Repository<Answer>,
  ) {}

  async checkQuestionContainingAnswer(question: Question, idAnswer: number) {
    const answer = await this.answerRepository.findOne({
      where: { id: idAnswer },
      relations: ['question'],
    });
    return answer.question.id === question.id;
  }

  async createAnswerOpenEnded(answer: Answer) {
    const answerDB = new Answer();
    answerDB.content = answer.content;
    answerDB.isCorrect = true;
    answerDB.question = answer.question;
    await this.answerRepository.save(answerDB);
    return answerDB;
  }

  async createQuestion(q: Question, questionnary: Questionnary) {
    const question = new Question();
    question.questionnary = questionnary;
    question.content = q.content;
    question.type = q.type;
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
      relations: ['answers'],
    });
  }

  async findQuestions(questionnary: Questionnary) {
    return await this.questionRepository.find({
      where: { questionnary: { id: questionnary.id } },
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
      relations: ['answers'],
    });

    if (questionDB) {
      let { id, ...questionWithoutId } = question;
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
}
