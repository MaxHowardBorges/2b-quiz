import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Questionnary } from '../entity/questionnary.entity';
import { QuestionService } from '../../question/service/question.service';
import { Question } from '../../question/entity/question.entity';
import { QuestionnaryCreateDto } from '../dto/questionnaryCreate.dto';
import { QuestionCreateDto } from '../../question/dto/questionCreate.dto';
import { AnswerCreateDto } from '../../question/dto/answerCreate.dto';
import { Answer } from '../../question/entity/answer.entity';
import { Teacher } from '../../user/entity/teacher.entity';
import { QuestionnaryDto } from '../dto/questionnary.dto';
import { QuestionnaryMapper } from '../../questionnary/mapper/questionnary.mapper';

@Injectable()
export class QuestionnaryService {
  constructor(
    @InjectRepository(Questionnary)
    private readonly questionnaryRepository: Repository<Questionnary>,
    private questionService: QuestionService,
    private questionnaryMapper: QuestionnaryMapper,
  ) {}

  async createQuestionnary(
    questionnaryDto: QuestionnaryCreateDto,
    author: Teacher,
    isCompilated = false,
  ) {
    const questionnary = this.dtoToQuestionnary(questionnaryDto);
    questionnary.author = author;
    questionnary.isCompilated = isCompilated;
    await this.questionnaryRepository.save(questionnary);
    for (const q of questionnary.questions) {
      await this.questionService.createQuestion(q, questionnary);
    }

    return questionnary;
  }

  //Create new questionnary from Questionnary id array
  async createQuestionnaryFromIdArray(
    idQuestionnarys: number[],
    author: Teacher,
  ) {
    const questionnaryDto: QuestionnaryDto[] = [];
    for (const idQuestionnary of idQuestionnarys) {
      const foundQuestionnary = await this.findQuestionnary(idQuestionnary);
      if (foundQuestionnary) {
        foundQuestionnary.questions =
          await this.findQuestionsFromIdQuestionnary(foundQuestionnary.id);
        for (const question of foundQuestionnary.questions) {
          question.answers = await this.questionService.findAnswers(
            question.id,
          );
        }
        questionnaryDto.push(
          this.questionnaryMapper.entityToQuestionnaryDto(foundQuestionnary),
        );
      }
    }
    //Combine all questionnaryDto in one questionnaryDto
    const questionnaryDtoCombined = new QuestionnaryCreateDto();
    questionnaryDtoCombined.title = 'Questionnary Combined';
    questionnaryDtoCombined.questions = [];
    for (const questionnary of questionnaryDto) {
      for (const question of questionnary.questions) {
        questionnaryDtoCombined.questions.push(question);
      }
    }
    //Create questionnary from questionnaryDtoCombined
    return await this.createQuestionnary(questionnaryDtoCombined, author, true);
  }

  //Transform Questionnary to QuestionnaryCreateDto
  async questionnaryToDto(questionnary: Questionnary) {
    const questionnaryDto = new QuestionnaryCreateDto();
    questionnaryDto.title = questionnary.title;
    questionnaryDto.questions = [];
    const questions = await this.questionService.findQuestions(questionnary);
    for (const question of questions) {
      questionnaryDto.questions.push(await this.questionToDto(question));
    }
    return questionnaryDto;
  }

  //Transform Question to QuestionCreateDto
  async questionToDto(question: Question) {
    const questionDto = new QuestionCreateDto();
    questionDto.content = question.content;
    questionDto.type = question.type;
    questionDto.answers = [];
    const answers = await this.questionService.findAnswers(question.id);
    for (const answer of answers) {
      questionDto.answers.push(this.answerToDto(answer));
    }
    return questionDto;
  }

  //Transform Answer to AnswerCreateDto
  answerToDto(answer: Answer) {
    const answerDto = new AnswerCreateDto();
    answerDto.content = answer.content;
    answerDto.isCorrect = answer.isCorrect;
    return answerDto;
  }

  async deleteQuestionnary(idQuestionnary: number) {
    const questionnary = await this.questionnaryRepository.findOne({
      relations: {
        questions: true,
      },
      where: { id: idQuestionnary },
    });

    if (questionnary) {
      for (const question of questionnary.questions) {
        await this.questionService.deleteQuestion(questionnary, question.id);
      }
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
    //TODO get from user questionnary bank

    return await this.questionnaryRepository.find({
      relations: {
        author: true,
      },
      where: { author: { id: teacher.id }, isCompilated: false },
    });
  }

  async findQuestionnariesFromIdUserWithQuestions(teacher: Teacher) {
    // questionnaires without questions

    return await this.questionnaryRepository.find({
      relations: {
        author: true,
        questions: true,
      },
      where: { author: { id: teacher.id }, isCompilated: false },
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
