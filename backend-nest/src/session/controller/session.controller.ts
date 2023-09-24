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

  @Post('/start') //TODO review utility
  startSession(@Body() idSession: { id: string }): boolean {
    return this.sessionService.startSession(idSession);
  }

  @Post('/nextQuestion')
  nextQuestion(
    @Body() idSession: { id: string },
  ): Question | NonNullable<unknown> {
    const question = this.sessionService.nextQuestion(idSession);
    if (question) {
      return question;
    }
    return {};
  }

  @Get('/list')
  getMap() {
    return this.sessionService.getMap();
  }

  @Post('/join')
  @HttpCode(HttpStatus.NO_CONTENT)
  joinSession(@Body() body: { idSession: string; username: string }) {
    this.sessionService.join(body.idSession, body.username);
  }

  @Post('/question/current') //TODO go to get
  getCurrentQuestion(
    @Body() idSession: { idSession: string },
  ): CurrentQuestionDto {
    const question = this.sessionService.currentQuestion(idSession.idSession);
    return this.sessionMapper.mapCurrentQuestionDto(question);
  }

  @Post('/respond')
  @HttpCode(HttpStatus.NO_CONTENT)
  async respondQuestion(
    @Body() body: { idSession: string; answer: number; username: string },
  ) {
    await this.sessionService.saveAnswer(
      body.idSession,
      body.answer,
      body.username,
    );
  }
}
