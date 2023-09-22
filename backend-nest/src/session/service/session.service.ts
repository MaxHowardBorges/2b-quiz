import { Body, Get, Injectable, Post } from '@nestjs/common';
import { Session } from '../dto/session';
import { QuestionService } from '../../question/service/question.service';
import { Question } from '../../question/entity/question.entity';

@Injectable()
export class SessionService {
  private sessionMap: Map<string, Session> = new Map();
  constructor(private questionService: QuestionService) {}

  async initializeSession(): Promise<Session> {
    let idSession = this.generateIdSession();
    while (this.sessionMap.has(idSession)) {
      idSession = this.generateIdSession();
    }

    this.sessionMap.set(idSession, await this.createSession(idSession));
    return this.sessionMap.get(idSession);
  }
  generateIdSession(): string {
    return Math.floor(Math.random() * (1000000 - 100000) + 100000).toString(); // nombre aléatoire de 6 chiffres
  }

  async createSession(idSession: string): Promise<Session> {
    return new Session(
      idSession,
      await this.questionService.findAllWithQuestion(),
    );
  }

  startSession(@Body() idSession: { id: string }): boolean {
    return this.sessionMap.has(idSession.id);
  }

  nextQuestion(@Body() idSession: { id: string }): Question | boolean{
    let currentSession = this.sessionMap.get(idSession.id);
    if (
      currentSession.getQuestionNumber + 1 <
      currentSession.getQuestionList.length
    ) {
      currentSession.setQuestionNumber = currentSession.getQuestionNumber + 1;
      return currentSession.getQuestionList[currentSession.getQuestionNumber];
    }
    else {
      return false;
    }
  }

  getMap() {
    return [...this.sessionMap];
  }

  getCurrentQuestion(@Body() idSession: { id: string }): Question {
    let session = this.sessionMap.get(idSession.id);
    return session.getQuestionList[session.getQuestionNumber];
  }
}
