import { Body, Controller, Get, Post } from '@nestjs/common';
import { Session } from '../dto/session';
import { QuestionService } from '../../question/service/question.service';
import { SessionService } from '../service/session.service';
import { Question } from '../../question/entity/question.entity';

@Controller('session')
export class SessionController {
  constructor(
    private questionService: QuestionService,
    private sessionService: SessionService,
  ) {}

  @Post('/create')
  async createSession(): Promise<Session> {
    return this.sessionService.initializeSession();
  }

  @Post('/start')
  startSession(@Body() idSession: { id: string }): boolean {
    return this.sessionService.startSession(idSession);
  }

  @Post('/nextQuestion')
  nextQuestion(@Body() idSession: { id: string }): Question | boolean{
    return this.sessionService.nextQuestion(idSession);
  }

  @Get('/list')
  getMap() {
    return this.sessionService.getMap();
  }

  @Post('/currentQuestion')
  getCurrentQuestion(@Body() idSession: { id: string }): Question {
    return this.sessionService.getCurrentQuestion(idSession);
  }
}
