import { Question } from '../../question/entity/question.entity';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { Session } from '../session';
import { JoinSessionDto } from '../dto/joinSession.dto';
import { CurrentQuestionDto } from '../dto/currentQuestion.dto';
import { SessionService } from '../service/session.service';
import { SessionMapper } from '../mapper/session.mapper';
import { BodyEmptyException } from '../exception/bodyEmpty.exception';
import { QuestionnaryDto } from '../../questionnary/dto/questionnary.dto';
import { RespondQuestionDto } from '../dto/respondQuestion.dto';
import { GetCurrentQuestionDto } from '../dto/getCurrentQuestion.dto';
import { NextQuestionDto } from '../dto/nextQuestion.dto';

@Controller('session')
export class SessionController {
  constructor(
    private sessionService: SessionService,
    private readonly sessionMapper: SessionMapper,
  ) {}

  @Post('/create')
  async createSession(@Body(new ValidationPipe()) ids : number[]): Promise<Session> {
    return this.sessionService.initializeSession(ids);
  }

  @Post('/nextQuestion')
  nextQuestion(
    @Body(new ValidationPipe()) body: NextQuestionDto,
  ): Question | NonNullable<unknown> {
    const question = this.sessionService.nextQuestion(body.idSession);
    if (question) {
      return question;
    }
    return {};
  }

  @Post('/join')
  @HttpCode(HttpStatus.NO_CONTENT)
  joinSession(@Body(new ValidationPipe()) body: JoinSessionDto) {
    this.sessionService.join(body.idSession, body.username);
  }

  @Post('/question/current') //TODO go to get
  getCurrentQuestion(
    @Body(new ValidationPipe()) body: GetCurrentQuestionDto,
  ): CurrentQuestionDto {
    const question = this.sessionService.currentQuestion(body.idSession);
    return this.sessionMapper.mapCurrentQuestionDto(question);
  }

  @Post('/respond')
  @HttpCode(HttpStatus.NO_CONTENT)
  async respondQuestion(
    @Body(new ValidationPipe())
    body: RespondQuestionDto,
  ) {
    await this.sessionService.saveAnswer(
      body.idSession,
      body.answer,
      body.username,
    );
  }

  @Get('/getMap')
  async getMap(@Query('idsession') idSession: string) {
    const a = this.sessionService.getMapUser(idSession);
    this.sessionService.getMap();
    return [
      this.sessionService.getQuestionList(idSession),
      this.sessionMapper.mapUserAnswerDto(a),
    ];
  }
}
