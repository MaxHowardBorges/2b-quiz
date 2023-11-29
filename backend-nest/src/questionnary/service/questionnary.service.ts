import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Questionnary } from '../entity/questionnary.entity';
import { QuestionService } from '../../question/service/question.service';
import { Question } from '../../question/entity/question.entity';

@Injectable()
export class QuestionnaryService {
  constructor(
    @InjectRepository(Questionnary)
    private readonly questionnaryRepository: Repository<Questionnary>,
    private questionService: QuestionService,
  ) {}

  async createQuestionnary(questionnary : Questionnary) {
    await this.questionnaryRepository.save(questionnary);
    for (const q of questionnary.questions) {
      await this.questionService.createQuestion(q, questionnary);
    }

    return questionnary;
  }

  async deleteQuestionnary(idQuestionnary: number) {
    const questionnary = await this.questionnaryRepository.findOne({
      where: { id: idQuestionnary },
    });

    if (questionnary) {
      await this.questionService.deleteQuestions(questionnary);
      await this.questionnaryRepository.delete(idQuestionnary);
    }
    return !!questionnary;
  }

  async findQuestionnary(idQuestionnary : number) {
    const questionnaryDB = await this.questionnaryRepository.findOne({
      where: { id: idQuestionnary },
    });

    const questionnary = new Questionnary();
    if (questionnaryDB) {
      questionnary.id = questionnaryDB.id;
      questionnary.author = questionnaryDB.author;
      questionnary.title = questionnaryDB.title;
      questionnary.questions =
        await this.questionService.findQuestion(questionnaryDB);
    }
    return questionnary
  }

  async findQuestionnaryFromUser(idUser : number) {//TODO get from user questionnary bank
    const questionnaryDB = await this.questionnaryRepository.find();

    const questionnaries: Questionnary[] = [];
    if (questionnaryDB) {
      for (const q of questionnaryDB) {
        const index = questionnaryDB.indexOf(q);
        const questionnary = new Questionnary();
        questionnary.id = questionnaryDB[index].id;
        questionnary.author = questionnaryDB[index].author;
        questionnary.title = questionnaryDB[index].title;
        questionnary.questions = await this.questionService.findQuestion(questionnaryDB[index]);
        questionnaries.push(questionnary);
      }
    }
    return questionnaries
  }

  async addQuestion(idQuestionnary: number, question: Question) {
    const questionnary = await this.questionnaryRepository.findOne({
      where: { id: idQuestionnary },
    });
    if (questionnary) {
      return await this.questionService.createQuestion(
        question,
        questionnary,
      );
    }
    return !!questionnary;
  }

  async deleteQuestion(idQuestionnary: number, idQuestion: number) {
    const questionnary = await this.questionnaryRepository.findOne({
      where: { id: idQuestionnary },
    });

    if (questionnary) {
      return await this.questionService.deleteQuestion(
        questionnary,
        idQuestion,
      );
    }
    return !!questionnary;
  }

  async modifyQuestion(
    idQuestionnary: number,
    idQuestion: number,
    question: Question,
  ) {
    const questionnary = await this.questionnaryRepository.findOne({
      where: { id: idQuestionnary },
    });
    if (questionnary) {
      return await this.questionService.modifyQuestion(
        question,
        questionnary,
        idQuestion,
      );
    }
    return !!questionnary;
  }

  async modifyQuestionnary(idQuestionnary: number, questionnaryName: string) {
    const questionnary = await this.questionnaryRepository.findOne({
      where: { id: idQuestionnary },
    });
    if (questionnary) {
      questionnary.title = questionnaryName;
      await this.questionnaryRepository.save(questionnary);
    }
    return !!questionnary;
  }
}
