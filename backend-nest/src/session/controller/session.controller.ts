import { Body, Controller, Get, Post } from '@nestjs/common';
import { SessionDto } from '../dto/session.dto';
import { QuestionService } from '../../question/service/question.service';
import { SessionService } from '../service/session.service';
import { Question } from '../../question/entity/question.entity';

@Controller('session')
export class SessionController {
  private sessionMap: Map<string, SessionDto> = new Map();
  constructor(
    private questionService: QuestionService,
    private sessionService: SessionService,
  ) {}

  @Post('/generateId')
  async generateIdSession(): Promise<SessionDto> {
    let idSession = this.sessionService.generateIdSession();
    while (this.sessionMap.has(idSession)) {
      idSession = this.sessionService.generateIdSession();
    }

    this.sessionMap.set(
      idSession,
      await this.sessionService.createSession(idSession)
    );
    return this.sessionMap.get(idSession);
  }

  @Post('/start')
  startSession(@Body() idSession: { id: string }): boolean {
    return this.sessionMap.has(idSession.id);
  }

  @Post('/nextQuestion')
  nextQuestion(@Body() idSession: { id: string }): Question {
    let currentSession = this.sessionMap.get(idSession.id);
    if ((currentSession.getQuestionNumber + 1) <= currentSession.getQuestionList.length) {
      currentSession.setQuestionNumber = currentSession.getQuestionNumber + 1;
    }
    return currentSession.getQuestionList[currentSession.getQuestionNumber];
  }

  @Get('/list')
  getMap() {
    return [...this.sessionMap];
  }

  @Post('/currentQuestion')
  getCurrentQuestion(@Body() idSession: { id: string }) : Question {
    let session = this.sessionMap.get(idSession.id);
    return session.getQuestionList[session.getQuestionNumber];
  }
}
