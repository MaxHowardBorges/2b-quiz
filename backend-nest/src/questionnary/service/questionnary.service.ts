import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Questionnary } from '../entity/questionnary.entity';
import { QuestionService } from '../../question/service/question.service';
import { QuestionnaryCreateDto } from '../dto/questionnaryCreate.dto';
import { QuestionCreateDto } from '../../question/dto/questionCreate.dto';
import { Teacher } from '../../user/entity/teacher.entity';

@Injectable()
export class QuestionnaryService {
  constructor(
    @InjectRepository(Questionnary)
    private readonly questionnaryRepository: Repository<Questionnary>,
    private questionService: QuestionService,
  ) {}

  async createQuestionnary(
    questionnaryDto: QuestionnaryCreateDto,
    author: Teacher,
  ) {
    const questionnary = this.dtoToQuestionnary(questionnaryDto);
    questionnary.author = author;
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

  async questionnaryExists(idQuestionnary: number) {
    return !!(await this.findQuestionnary(idQuestionnary));
  }

  async findQuestionnary(idQuestionnary: number) {
    //questionnary without questions
    return await this.questionnaryRepository.findOne({
      where: { id: idQuestionnary },
    });
  }

  async findQuestionnaryWithQuestionsId(idQuestionnary: number) {
    return await this.questionnaryRepository.findOne({
      relations: {
        questions: true,
      },
      where: { id: idQuestionnary },
    });
  }

  async findQuestionnariesFromIdUser(teacher: Teacher) {
    // questionnaires without questions
    return await this.questionnaryRepository.find({
      relations: ['author'],
      where: { author: { id: teacher.id } },
    });
  }

  async findQuestionnariesFromIdUserWithQuestions(teacher: Teacher) {
    // questionnaires without questions

    return await this.questionnaryRepository.find({
      relations: {
        author: true,
        questions: true,
      },
      where: { author: { id: teacher.id } },
    });
  }

  async findQuestionsFromIdQuestionnary(idQuestionnary: number) {
    // questions without answers
    return this.questionService.findQuestions(
      await this.questionnaryRepository.findOne({
        where: { id: idQuestionnary },
      }),
    );
  }

  async addQuestion(
    teacher: Teacher,
    idQuestionnary: number,
    questionDto: QuestionCreateDto,
  ) {
    const question = this.questionService.dtoToQuestion(
      questionDto,
      await this.questionnaryRepository.findOne({
        where: { id: idQuestionnary },
      }),
    );
    question.author = teacher;
    const questionnary = await this.questionnaryRepository.findOne({
      where: { id: idQuestionnary },
    });
    if (questionnary) {
      return await this.questionService.createQuestion(question, questionnary);
    }
  }

  async deleteQuestion(idQuestionnary: number, idQuestion: number) {
    const questionnary = await this.questionnaryRepository.findOne({
      where: { id: idQuestionnary },
    });

    if (questionnary) {
      const question = await this.questionService.findQuestion(idQuestion);
      if (question.originalId === null) {
        await this.questionService.modifyQuestionsOriginalId(idQuestion);
      }

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
      const question = this.questionService.dtoToQuestion(
        questionDto,
        await this.questionnaryRepository.findOne({
          where: { id: idQuestionnary },
        }),
      );
      if (question.originalId === null) {
        await this.questionService.modifyQuestionsOriginalId(idQuestion);
      }
      return await this.questionService.modifyQuestion(
        question,
        questionnary,
        idQuestion,
      );
    }
    return !!questionnary;
  }

  async modifyQuestionnary(
    idQuestionnary: number,
    questionnaryName: string,
    author: Teacher,
  ) {
    const questionnary = await this.questionnaryRepository.findOne({
      where: { id: idQuestionnary },
    });
    if (questionnary) {
      questionnary.title = questionnaryName;
      questionnary.author = author;
      await this.questionnaryRepository.save(questionnary);
    }
    return !!questionnary;
  }

  dtoToQuestionnary(questionnaryDto: QuestionnaryCreateDto) {
    const questionnary = new Questionnary();
    questionnary.id = null;
    questionnary.title = questionnaryDto.title;
    questionnary.questions = [];
    for (const questionDto of questionnaryDto.questions) {
      questionnary.questions.push(
        this.questionService.dtoToQuestion(questionDto, questionnary),
      );
    }
    return questionnary;
  }

  async isQuestionnaryFromTeacher(idQuestionnary: number, teacher: Teacher) {
    const questionnary = await this.findOne(idQuestionnary, ['author']);
    return questionnary.author.id === teacher.id;
  }

  async findOne(idQuestionnary: number, relations: string[]) {
    return await this.questionnaryRepository.findOne({
      where: { id: idQuestionnary },
      relations: relations,
    });
  }
}
