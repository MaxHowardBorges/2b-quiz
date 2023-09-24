import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Session } from '../session';
import { CurrentQuestionDto } from '../dto/currentQuestion.dto';
import { SessionService } from '../service/session.service';

@Controller('session')
export class SessionController {
  constructor(private sessionService: SessionService) {}

  @Post('/join')
  @HttpCode(HttpStatus.NO_CONTENT)
  joinSession(@Body() body: { id: string; username: string }) {
    this.sessionService.join(body.id, body.username);
  }

  @Post('/question/current')
  getCurrentQuestion(@Body() idSession: { id: string }): CurrentQuestionDto {
    return this.sessionService.currentQuestion(idSession.id);
  }

  @Post('/respond')
  @HttpCode(HttpStatus.NO_CONTENT)
  async respondQuestion(
    @Body() body: { id: string; answer: number; username: string },
  ) {
    await this.sessionService.respond(body.id, body.answer, body.username);
  }

  @Post('/create')
  async createSession(): Promise<Session> {
    return this.sessionService.create();
  }
}
