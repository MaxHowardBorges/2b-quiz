import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Session } from '../session';
import { CurrentQuestionDto } from '../dto/currentQuestion.dto';
import { SessionService } from '../service/session.service';

@Controller('session')
export class SessionController {
  constructor(private sessionService: SessionService) {}

  @Post('/join')
  @HttpCode(HttpStatus.NO_CONTENT)
  joinSession(@Body() body: { idSession: string; username: string }) {
    this.sessionService.join(body.idSession, body.username);
  }

  @Post('/question/current')
  getCurrentQuestion(
    @Body() idSession: { idSession: string },
  ): CurrentQuestionDto {
    return this.sessionService.currentQuestion(idSession.idSession);
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

  @Post('/create')
  async createSession(): Promise<Session> {
    return this.sessionService.create();
  }
}
