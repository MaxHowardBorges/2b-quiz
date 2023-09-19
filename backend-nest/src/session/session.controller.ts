import { Controller, Post } from '@nestjs/common';
import { Session } from './session';
import { QuestionService } from '../question/service/question.service';
import { SessionService } from './session.service';

@Controller('session')
export class SessionController {
  private sessionMap: Map<string, Session> = new Map();
  constructor(
    private questionService: QuestionService,
    private sessionService: SessionService,
  ) {}

  @Post('/create')
  createSession(): string {
    let idSession = this.sessionService.createSession();
    !this.sessionMap.has(idSession) ? this.sessionMap.set(idSession,new Session()) : false;
    return idSession;
  }
}
