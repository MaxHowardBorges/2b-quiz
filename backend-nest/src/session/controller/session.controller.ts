import { Question } from '../../question/entity/question.entity';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { Session } from '../session';
import { CurrentQuestionDto } from '../dto/currentQuestion.dto';
import { SessionService } from '../service/session.service';
import { SessionMapper } from '../mapper/session.mapper';
import { BodyEmptyException } from '../exception/bodyEmpty.exception';
import { Answer } from 'src/question/entity/answer.entity';
import any = jasmine.any;

@Controller('session')
export class SessionController {
  constructor(
    private sessionService: SessionService,
    private readonly sessionMapper: SessionMapper,
  ) {}

  @Post('/create')
  async createSession(): Promise<Session> {
    return this.sessionService.initializeSession();
  }

  @Post('/nextQuestion')
  nextQuestion(@Body() body: { id: string }): Question | NonNullable<unknown> {
    if (body.id == undefined) {
      throw new BodyEmptyException();
    }
    const question = this.sessionService.nextQuestion(body.id);
    if (question) {
      return question;
    }
    return {};
  }

  @Post('/join')
  @HttpCode(HttpStatus.NO_CONTENT)
  joinSession(@Body() body: { idSession: string; username: string }) {
    if (body.idSession == undefined || body.username == undefined) {
      throw new BodyEmptyException();
    }
    this.sessionService.join(body.idSession, body.username);
  }

  @Post('/question/current') //TODO go to get
  getCurrentQuestion(@Body() body: { idSession: string }): CurrentQuestionDto {
    if (body.idSession == undefined) {
      throw new BodyEmptyException();
    }
    const question = this.sessionService.currentQuestion(body.idSession);
    return this.sessionMapper.mapCurrentQuestionDto(question);
  }

  @Post('/respond')
  @HttpCode(HttpStatus.NO_CONTENT)
  async respondQuestion(
    @Body() body: { idSession: string; answer: number; username: string },
  ) {
    if (
      body.idSession == undefined ||
      body.answer == undefined ||
      body.username == undefined
    ) {
      throw new BodyEmptyException();
    }
    await this.sessionService.saveAnswer(
      body.idSession,
      body.answer,
      body.username,
    );
  }

  @Get('/getMap')
  async getMap(@Body() body: { idSession: string }) {
    const a = this.sessionService.getMapUser(body.idSession);
    this.sessionService.getMap();
    return [
      this.sessionService.getQuestionList(body.idSession),
      this.sessionMapper.mapUserAnswerDto(a),
    ];
  }
}
