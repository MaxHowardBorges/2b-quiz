import { Injectable } from '@nestjs/common';
import { AnswerMapper } from '../../question/mapper/answer.mapper';
import { Session } from '../session';
import { QuestionService } from '../../question/service/question.service';
import { Question } from '../../question/entity/question.entity';
import { Answer } from '../../question/entity/answer.entity';
import { IdSessionNoneException } from '../exception/idSessionNone.exception';
import { QuestionNumberNoneException } from '../exception/questionNumberNone.exception';

@Injectable()
export class SessionService {
  private sessionMap: Map<string, Session> = new Map<string, Session>();
  private userAnswers: Map<string, Map<Question, Answer>> = new Map<
    string,
    Map<Question, Answer>
  >();

  constructor(
    private answerMapper: AnswerMapper,
    private questionService: QuestionService,
  ) {}

  join(idSession: string) {
    if (this.sessionMap.has(idSession) == false) {
      throw new IdSessionNoneException();
    }
    return this.sessionMap.has(idSession);
  }

  currentQuestion(idSession: string): any {
    if (this.sessionMap.get(idSession) == undefined) {
      throw new IdSessionNoneException();
    }
    const session = this.sessionMap.get(idSession);

    const indice = session.questionNumber;
    const question = session.questionList[indice];
    const answers = this.answerMapper.mapAnswersStudentDtos(question.answers);
    return { question, answers };
  }

  respond(idSession: string, idAnswer: number) {
    // eviter les trucs cassables, gerer si la session ex pas pareil pr la reponse
    if (this.sessionMap.get(idSession) == undefined) {
      throw new IdSessionNoneException();
    }

    const session = this.sessionMap.get(idSession);
    if (session.questionNumber == undefined) {
      throw new QuestionNumberNoneException();
    }
    const indice = session.questionNumber;
    const question = session.questionList[indice];

    return this.questionService.questionContainsAnswer(question, idAnswer);
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
    return this.sessionMap.get(idSession);
  }
}
