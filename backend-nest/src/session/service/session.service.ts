import { Injectable } from '@nestjs/common';
import { AnswerMapper } from '../../question/mapper/answer.mapper';
import { Session } from '../session';
import { QuestionService } from '../../question/service/question.service';

@Injectable()
export class SessionService {
  private sessionMap: Map<string, Session> = new Map<string, Session>();

  constructor(
    private answerMapper: AnswerMapper,
    private questionService: QuestionService,
  ) {}

  join(idSession: string) {
    return this.sessionMap.has(idSession);
  }

  currentQuestion(idSession: string) {
    console.log(idSession);
    console.log(this.sessionMap.keys());
    console.log(this.sessionMap.has(idSession));

    const indice = this.sessionMap.get(idSession).questionNumber;

    const question = this.sessionMap.get(idSession).questionList[indice];
    const answers = this.answerMapper.mapAnswersStudentDtos(question.answers);
    return { question, answers };
  }

  respond(idSession: string, idAnswer: number) {
    const indice = this.sessionMap.get(idSession).questionNumber;
    const question = this.sessionMap.get(idSession).questionList[indice];

    for (let i = 0; i < question.answers.length; i++) {
      if (question.answers[i].id == idAnswer) {
        return true;
      }
    }
    return false;
  }

  // TEST
  createSession(): string {
    return Math.floor(Math.random() * (1000000 - 100000) + 100000).toString(); // nombre aléatoire de 6 chiffres
  }

  async create() {
    let idSession = '000000';
    do {
      idSession = this.createSession();
    } while (this.sessionMap.has(idSession));

    this.sessionMap.set(
      idSession,
      new Session(idSession, await this.questionService.findAllWithQuestion()),
    );
    const t = this.sessionMap.size;
    console.log(t);
    return this.sessionMap.get(idSession);
  }

  get() {
    return this.sessionMap;
  }
}
