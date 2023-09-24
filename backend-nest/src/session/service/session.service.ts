import { Injectable } from '@nestjs/common';
import { AnswerMapper } from '../../question/mapper/answer.mapper';
import { Session } from '../session';
import { QuestionService } from '../../question/service/question.service';
import { IdSessionNoneException } from '../exception/idSessionNone.exception';
import { QuestionNumberNoneException } from '../exception/questionNumberNone.exception';
import { AnswersNoneException } from '../exception/answersNone.exception';
import { QuestionNoneException } from '../exception/questionNone.exception';
import { UserAlreadyJoinedException } from '../exception/userAlreadyJoined.exception';
import { AnswerNotOfCurrentQuestionException } from '../exception/answerNotOfCurrentQuestion.exception';
import { Question } from '../../question/entity/question.entity';
import { Answer } from '../../question/entity/answer.entity';
import { UserUnknownException } from '../exception/userUnknown.exception';

@Injectable()
export class SessionService {
  private sessionMap: Map<string, Session> = new Map<string, Session>();

  constructor(
    private answerMapper: AnswerMapper,
    private questionService: QuestionService,
  ) {}

  join(idSession: string, username: string): void {
    if (this.sessionMap.has(idSession) == false) {
      throw new IdSessionNoneException();
    }
    const session = this.sessionMap.get(idSession);
    if (session.connectedUser.has(username)) {
      throw new UserAlreadyJoinedException();
    }
    session.connectedUser.add(username);
    session.userAnswers.set(username, new Map<Question, Answer>());
  }

  currentQuestion(idSession: string): any {
    if (this.sessionMap.get(idSession) == undefined) {
      throw new IdSessionNoneException();
    }
    const session = this.sessionMap.get(idSession);

    if (session.questionNumber == undefined) {
      throw new QuestionNumberNoneException();
    }
    const indice = session.questionNumber;

    if (session.questionList[indice] == undefined) {
      throw new QuestionNoneException();
    }
    const question = session.questionList[indice];

    if (
      this.answerMapper.mapAnswersStudentDtos(question.answers) == undefined
    ) {
      throw new AnswersNoneException();
    }
    const answers = this.answerMapper.mapAnswersStudentDtos(question.answers);

    return { question, answers };
  }

  async respond(idSession: string, idAnswer: number, username: string) {
    // eviter les trucs cassables, gerer si la session ex pas pareil pr la reponse
    if (this.sessionMap.get(idSession) == undefined) {
      throw new IdSessionNoneException();
    }

    const session = this.sessionMap.get(idSession);
    const question = session.questionList[session.questionNumber];

    if (!session.connectedUser.has(username)) {
      throw new UserUnknownException();
    }
    if (
      !(await this.questionService.questionContainsAnswer(question, idAnswer))
    ) {
      throw new AnswerNotOfCurrentQuestionException();
    }
    session.userAnswers.get(username).set(
      question,
      question.answers.find((answer) => answer.id === idAnswer),
    );
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
