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

  @Post('/create')
  async createSession(): Promise<SessionDto> {
    let idSession = '000000';
    do {
      idSession = this.sessionService.createSession();
    } while (this.sessionMap.has(idSession));

    this.sessionMap.set(
      idSession,
      new SessionDto(idSession, await this.questionService.findAllWithQuestion()),
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
