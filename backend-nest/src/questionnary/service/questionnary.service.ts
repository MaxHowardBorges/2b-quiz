import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Questionnary } from '../entity/questionnary.entity';
import { QuestionService } from '../../question/service/question.service';
import { QuestionnaryDto } from '../dto/questionnary.dto';
import { QuestionCreateDto } from '../../question/dto/questionCreate.dto';
import { Question } from '../../question/entity/question.entity';
import { QuestionDto } from '../../question/dto/question.dto';

@Injectable()
export class QuestionnaryService {
  constructor(
    @InjectRepository(Questionnary)
    private readonly questionnaryRepository: Repository<Questionnary>,
    private questionService: QuestionService,
  ) {}

  async createQuestionnary(
    title: string,
    questions: QuestionCreateDto[],
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

  async createPrivateQuestionnary(questions: QuestionDto[]) {
    const questionnary = new Questionnary();
    questionnary.title = 'Private question bank';
    questionnary.author = 'Private';
    await this.questionnaryRepository.save(questionnary);
    for (const q of questions) {
      await this.questionService.createQuestion(q, questionnary);
    }

    return 'The question bank has been created';
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

  async findQuestionnary(idQuestionnary: number) {
    const questionnary = await this.questionnaryRepository.findOne({
      where: { id: idQuestionnary },
    });

    const questionnaryDto = new QuestionnaryDto();
    if (questionnary) {
      questionnaryDto.id = questionnary.id;
      questionnaryDto.author = questionnary.author;
      questionnaryDto.title = questionnary.title;
      questionnaryDto.questions =
        await this.questionService.findQuestion(questionnary);
    }
    return questionnaryDto.title != null
      ? questionnaryDto
      : 'pas de questionnaire trouvé';
  }

  async findQuestionnaryFromUser(idUser: number) {
    //TODO get from user questionnary bank
    const questionnary = await this.questionnaryRepository.find();

    const questionnaryDtos: QuestionnaryDto[] = [];
    if (questionnary) {
      for (const q of questionnary) {
        const index = questionnary.indexOf(q);
        const questionnaryDto = new QuestionnaryDto();
        questionnaryDto.id = questionnary[index].id;
        questionnaryDto.author = questionnary[index].author;
        questionnaryDto.title = questionnary[index].title;
        questionnaryDto.questions = await this.questionService.findQuestion(
          questionnary[index],
        );
        questionnaryDtos.push(questionnaryDto);
      }
    }
    return questionnaryDtos.length > 0
      ? questionnaryDtos
      : 'pas de questionnaires trouvés';
  }

  async addQuestion(idQuestionnary: number, questionDto: QuestionCreateDto) {
    const questionnary = await this.questionnaryRepository.findOne({
      where: { id: idQuestionnary },
    });
    if (questionnary) {
      return await this.questionService.createQuestion(
        questionDto,
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
    questionDto: QuestionCreateDto,
  ) {
    const questionnary = await this.questionnaryRepository.findOne({
      where: { id: idQuestionnary },
    });
    if (questionnary) {
      return await this.questionService.modifyQuestion(
        questionDto,
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
