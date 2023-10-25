import { Body, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from '../../question/entity/question.entity';
import { Repository } from 'typeorm';
import { Answer } from '../../question/entity/answer.entity';
import { Questionnary } from '../entity/questionnary.entity';
import { QuestionDto } from '../../question/dto/question.dto';

@Injectable()
export class QuestionnaryService {
  constructor(
    @InjectRepository(Questionnary)
    private readonly questionnaryRepository: Repository<Questionnary>,
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    @InjectRepository(Answer)
    private readonly answerRepository: Repository<Answer>,
  ) {}

  async createQuestionnary(
    title: string,
    questions: QuestionDto[],
    author: string,
  ) {
    const questionnary = new Questionnary();
    questionnary.title = title;
    questionnary.author = author;

    await this.questionnaryRepository.save(questionnary);
    for (const q of questions) {
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
    }

    return questionnary;
  }

  async deleteQuestionnary(
    idQuestionnary: number,
  ) {
    const questionnary = await this.questionnaryRepository.findOne({where: {id: idQuestionnary}});

    if (questionnary) {
      // Supprimer toutes les réponses associées aux questions du questionnaire
      const questions = await this.questionRepository.find({ where: { questionnary } });
      for (const question of questions) {
        await this.answerRepository.delete({ question });
      }
      // Supprimer toutes les questions associées au questionnaire
      await this.questionRepository.delete({ questionnary });
      // Enfin, supprimer le questionnaire lui-même
      await this.questionnaryRepository.delete(idQuestionnary);
    }
    return !!questionnary;
  }
}
