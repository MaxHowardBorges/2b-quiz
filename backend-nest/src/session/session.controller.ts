import { Controller, Post } from '@nestjs/common';
import { Session } from './session';
import { QuestionService } from '../question/service/question.service';
import { SessionService } from './session.service';

@Controller('session')
export class SessionController {
  private sessionMap: Map<string, Session>;
  constructor(
    private questionService: QuestionService,
    private sessionService: SessionService,
  ) {}

  @Post('/create')
  createSession(): string {
    return this.sessionService.createSession();
  }
}
