import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Questionnary } from '../entity/questionnary.entity';
import { QuestionDto } from '../../question/dto/question.dto';
import { QuestionService } from '../../question/service/question.service';
import { QuestionnaryDto } from '../dto/questionnary.dto';

@Injectable()
export class QuestionnaryService {
  constructor(
    @InjectRepository(Questionnary)
    private readonly questionnaryRepository: Repository<Questionnary>,
    private questionService: QuestionService,
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
      await this.questionService.createQuestion(q, questionnary);
    }

    return questionnary;
  }

  async deleteQuestionnary(idQuestionnary: number) {
    const questionnary = await this.questionnaryRepository.findOne({
      where: { id: idQuestionnary },
    });

    if (questionnary) {
      await this.questionService.deleteQuestion(questionnary);
      await this.questionnaryRepository.delete(idQuestionnary);
    }
    return !!questionnary;
  }

  async findQuestionnary(idQuestionnary) {
    const questionnary = await this.questionnaryRepository.findOne({
      where: { id: idQuestionnary },
    });

    const questionnaryDto = new QuestionnaryDto();
    if (questionnary) {
      questionnaryDto.author = questionnary.author;
      questionnaryDto.title = questionnary.title;
      questionnaryDto.questions =
        await this.questionService.findQuestion(questionnary);
    }
    return questionnaryDto.title != null
      ? questionnaryDto
      : 'pas de questionnaire trouvé';
  }
}
