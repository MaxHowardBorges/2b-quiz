import { Body, Controller, Get, Post } from '@nestjs/common';
import { Session } from './session';
import { QuestionService } from '../question/service/question.service';
import { SessionService } from './session.service';
import { Question } from '../question/entity/question.entity';

@Controller('session')
export class SessionController {
  private sessionMap: Map<string, Session> = new Map();
  constructor(
    private questionService: QuestionService,
    private sessionService: SessionService,
  ) {}

  @Post('/create')
  async createSession(): Promise<Session> {
    let idSession = '000000';
    do {
      idSession = this.sessionService.createSession();
    } while (this.sessionMap.has(idSession));

    this.sessionMap.set(
      idSession,
      new Session(idSession, await this.questionService.findAllWithQuestion()),
    );
    return this.sessionMap.get(idSession);
  }

  @Post('/start')
  startSession(@Body() idSession: { id: string }): boolean {
    return this.sessionMap.has(idSession.id);
  }

  /** @Post('/nextQuestion')
  nextQuestion(@Body() idSession: string): Promise<Question> {
    this.
  }**/

  @Get('/list')
  getMap() {
    return [...this.sessionMap];
  }
}
