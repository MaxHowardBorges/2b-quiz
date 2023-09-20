import { Injectable } from '@nestjs/common';
import { SessionDto } from '../dto/session.dto';
import { QuestionService } from '../../question/service/question.service';

@Injectable()
export class SessionService {
  constructor(
    private questionService: QuestionService
  ) {}
  generateIdSession(): string {
    return Math.floor(Math.random()*(1000000-100000)+100000).toString(); // nombre aléatoire de 6 chiffres
  }

  async createSession(idSession: string): Promise<SessionDto>{
    return new SessionDto(idSession, await this.questionService.findAllWithQuestion())
  }
}
