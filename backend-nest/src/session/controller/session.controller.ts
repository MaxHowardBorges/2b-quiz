import { Body, Controller, Post } from '@nestjs/common';
import { Session } from '../session';
import { CurrentQuestionDto } from '../dto/currentQuestion.dto';
import { SessionService } from '../service/session.service';

@Controller('session')
export class SessionController {
  constructor(private sessionService: SessionService) {}

  @Post('/join')
  joinSession(@Body() idSession: { id: string }) {
    return this.sessionService.join(idSession.id);
  }

  @Post('/question/current')
  getCurrentQuestion(@Body() idSession: { id: string }): CurrentQuestionDto {
    return this.sessionService.currentQuestion(idSession.id);
  }

  // @Post('/respond')
  // respondQuestion(
  //   @Body() idSession: { id: string },
  //   @Body() idAnswer: { answer: string },
  // ) {
  //   return this.sessionService.respond(idSession.id, idAnswer);
  // }

  @Post('/create')
  async createSession(): Promise<Session> {
    return this.sessionService.create();
  }
}
