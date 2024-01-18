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

  //Create new questionnary from Questionnary id array
  async createQuestionnaryFromIdArray(
    idQuestionnarys: number[],
    author: Teacher,
  ) {
    //Find all questionnarys from idQuestionnarys array
    //const questionnarys :Questionnary[] = await this.questionnaryRepository.find()
    //QuestionnaryCreateDto array for save dto
    const questionnaryDto: QuestionnaryCreateDto[] = [];
    // for (const id of questionnarys) {
    //   const questionnary = await this.questionnaryRepository.findOne({
    //     where: { 'questionnarys.id': id },
    //   });
    for (const idQuestionnary of idQuestionnarys) {
      const id = idQuestionnary; //questionnary.id; // Assuming Questionnary has an 'id' property

      const foundQuestionnary = await this.questionnaryRepository.findOne({
        where: { id },
      });
      if (foundQuestionnary) {
        //add questionnaryDto to questionnaryDto array
        questionnaryDto.push(await this.questionnaryToDto(foundQuestionnary));
      }
    }
    //Combine all questionnaryDto in one questionnaryDto
    const questionnaryDtoCombined = new QuestionnaryCreateDto();
    questionnaryDtoCombined.title = 'Questionnary Combined';
    questionnaryDtoCombined.questions = [];
    for (const q of questionnaryDto) {
      for (const question of q.questions) {
        questionnaryDtoCombined.questions.push(question);
      }
    }
    //Create questionnary from questionnaryDtoCombined
    const questionnary = await this.createQuestionnary(
      questionnaryDtoCombined,
      author,
    );
    //Update isCompilated to true and save with TypeOrm
    await this.questionnaryRepository.update(questionnary.id, {
      isCompilated: true,
    });
    return questionnary;
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
