import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Questionnary } from '../entity/questionnary.entity';
import { QuestionService } from '../../question/service/question.service';
import { Question } from '../../question/entity/question.entity';
import { QuestionnaryCreateDto } from '../dto/questionnaryCreate.dto';
import { QuestionCreateDto } from '../../question/dto/questionCreate.dto';
import { AnswerCreateDto } from '../../question/dto/answerCreate.dto';
import { TagDto } from '../../question/dto/tag.dto';
import { Answer } from '../../question/entity/answer.entity';
import { Tag } from '../../question/entity/tag.entity';

@Injectable()
export class QuestionnaryService {
  constructor(
    @InjectRepository(Questionnary)
    private readonly questionnaryRepository: Repository<Questionnary>,
    private questionService: QuestionService,
  ) {}

  async createQuestionnary(questionnaryDto: QuestionnaryCreateDto) {
    const questionnary = this.dtoToQuestionnary(questionnaryDto);
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

  async findQuestionnary(idQuestionnary: number) {
    //questionnary without questions
    return await this.questionnaryRepository.findOne({
      where: { id: idQuestionnary },
    });
  }

  async findQuestionnariesFromIdUser(idUser: number) {
    // questionnaries without questions
    //TODO get from user questionnary bank
    /*return await this.questionnaryRepository.find({
      where: {
        id: idUser,
      },
    });*/
    return await this.questionnaryRepository.find();
  }

  async findQuestionsFromIdQuestionnary(idQuestionnary: number) {
    // questions without answers
    return this.questionService.findQuestions(
      await this.questionnaryRepository.findOne({
        where: { id: idQuestionnary },
      }),
    );
  }

  async addQuestion(idQuestionnary: number, questionDto: QuestionCreateDto) {
    const question = this.dtoToQuestion(
      questionDto,
      await this.findQuestionnary(idQuestionnary),
    );
    const questionnary = await this.questionnaryRepository.findOne({
      where: { id: idQuestionnary },
    });
    if (questionnary) {
      return await this.questionService.createQuestion(question, questionnary);
    }
    return !!questionnary;
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
      const question = this.dtoToQuestion(
        questionDto,
        await this.findQuestionnary(idQuestionnary),
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
    author: number = 111111, //TODO get author id
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
    questionnary.author = questionnaryDto.author;
    questionnary.questions = [];
    for (const questionDto of questionnaryDto.questions) {
      questionnary.questions.push(
        this.dtoToQuestion(questionDto, questionnary),
      );
    }
    return questionnary;
  }
  dtoToQuestion(questionDto: QuestionCreateDto, questionnaryRef: Questionnary) {
    const question = new Question();
    question.id = null;
    question.content = questionDto.content;
    question.answers = [];
    question.questionnary = questionnaryRef;
    question.type = questionDto.type;
    question.originalId = questionDto.id !== undefined ? questionDto.id : null;
    question.idAuthor = questionDto.author;
    question.tags = [];
    for (const tagDto of questionDto.tags) {
      question.tags.push(this.dtoToTag(tagDto));
    }
    for (const answerDto of questionDto.answers) {
      question.answers.push(this.dtoToAnswer(answerDto, question));
    }
    return question;
  }
  dtoToAnswer(answerDto: AnswerCreateDto, questionRef: Question) {
    const answer = new Answer();
    answer.id = null;
    answer.content = answerDto.content;
    answer.isCorrect = answerDto.isCorrect;
    answer.question = questionRef;
    return answer;
  }

  dtoToTag(tagDto: TagDto) {
    const tag = new Tag();
    tag.idTag = tagDto.idTag;
    tag.description = tagDto.description;
    return tag;
  }
}
