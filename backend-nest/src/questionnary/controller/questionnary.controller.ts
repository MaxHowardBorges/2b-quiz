import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { QuestionnaryService } from '../service/questionnary.service';
import { QuestionnaryCreateDto } from '../dto/questionnaryCreate.dto';
import { QuestionCreateDto } from '../../question/dto/questionCreate.dto';
import { Questionnary } from '../entity/questionnary.entity';
import { Question } from '../../question/entity/question.entity';
import { Answer } from '../../question/entity/answer.entity';
import { AnswerCreateDto } from '../../question/dto/answerCreate.dto';

@Controller('questionnary')
export class QuestionnaryController {
  constructor(private readonly questionnaryService: QuestionnaryService) {}
  @Post('/create')
  createQuestionnary(
    @Body(new ValidationPipe()) questionnaryDto: QuestionnaryCreateDto,
  ) {
    return this.questionnaryService.createQuestionnary(
      this.DtoToQuestionnary(questionnaryDto),
    );
  }

  @Delete('/:id')
  async deleteQuestionnary(@Param('id', ParseIntPipe) idQuestionnary: number) {
    return this.questionnaryService.deleteQuestionnary(idQuestionnary);
  }

  @Get('/:id/select')
  selectQuestionnary(@Param('id', ParseIntPipe) idQuestionnary: number) {
    return this.questionnaryService.findQuestionnary(idQuestionnary);
  }

  @Get('/select/user/:id')
  selectQuestionnaryFromUser(@Param('id', ParseIntPipe) idUser: number) {
    return this.questionnaryService.findQuestionnaryFromUser(idUser);
  }

  @Post('/:id/add-question')
  async addQuestion(
    @Param('id', ParseIntPipe) idQuestionnary: number,
    @Body(new ValidationPipe()) questionDto: QuestionCreateDto,
  ) {
    return this.questionnaryService.addQuestion(
      idQuestionnary,
      this.DtoToQuestion(
        questionDto,
        await this.selectQuestionnary(idQuestionnary),
      ),
    );
  }

  @Delete('/:id/remove-question/:idQ')
  async deleteQuestion(
    @Param('id', ParseIntPipe) idQuestionnary: number,
    @Param('idQ', ParseIntPipe) idQuestion: number,
  ) {
    return this.questionnaryService.deleteQuestion(idQuestionnary, idQuestion);
  }

  @Patch('/:id/modify-question/:idQ')
  async modifyQuestion(
    @Param('id', ParseIntPipe) idQuestionnary: number,
    @Param('idQ', ParseIntPipe) idQuestion: number,
    @Body(new ValidationPipe()) questionDto: QuestionCreateDto,
  ) {
    return this.questionnaryService.modifyQuestion(
      idQuestionnary,
      idQuestion,
      this.DtoToQuestion(
        questionDto,
        await this.selectQuestionnary(idQuestionnary),
      ),
    );
  }

  @Patch('/:id/modify-questionnary/')
  modifyQuestionnary(
    @Param('id', ParseIntPipe) idQuestionnary: number,
    @Body() body: { questionnaryName: string },
  ) {
    return this.questionnaryService.modifyQuestionnary(
      idQuestionnary,
      body.questionnaryName,
    );
  }

  DtoToQuestionnary(questionnaryDto: QuestionnaryCreateDto) {
    const questionnary = new Questionnary();
    questionnary.id = null;
    questionnary.title = questionnaryDto.title;
    questionnary.author = questionnaryDto.author;
    questionnary.questions = [];
    for (const questionDto of questionnaryDto.questions) {
      questionnary.questions.push(
        this.DtoToQuestion(questionDto, questionnary),
      );
    }
    return questionnary;
  }
  DtoToQuestion(questionDto: QuestionCreateDto, questionnaryRef: Questionnary) {
    const question = new Question();
    question.id = null;
    question.content = questionDto.content;
    question.type = questionDto.type;
    question.answers = [];
    question.questionnary = questionnaryRef;
    for (const answerDto of questionDto.answers) {
      question.answers.push(this.DtoToAnswer(answerDto, question));
    }
    return question;
  }
  DtoToAnswer(answerDto: AnswerCreateDto, questionRef: Question) {
    const answer = new Answer();
    answer.id = null;
    answer.content = answerDto.content;
    answer.isCorrect = answerDto.isCorrect;
    answer.question = questionRef;
    return answer;
  }
}
