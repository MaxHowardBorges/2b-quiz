import { Body, Injectable } from '@nestjs/common';
import { Session } from '../session';
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

  nextQuestion(@Body() idSession: { id: string }): Question {
    const currentSession = this.sessionMap.get(idSession.id);
    if (
      currentSession.getQuestionNumber + 1 <
      currentSession.getQuestionList.length
    ) {
      currentSession.setQuestionNumber = currentSession.getQuestionNumber + 1;
      return currentSession.getQuestionList[currentSession.getQuestionNumber];
    }
    return null;
  }

  getMap() {
    return [...this.sessionMap];
  }

  getCurrentQuestion(@Body() idSession: { id: string }): Question {
    const session = this.sessionMap.get(idSession.id);
    return session.getQuestionList[session.getQuestionNumber];
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

  currentQuestion(idSession: string): Question {
    if (this.sessionMap.get(idSession) == undefined) {
      throw new IdSessionNoneException();
    }
    const session = this.sessionMap.get(idSession);

    if (session.questionNumber == undefined) {
      throw new QuestionNumberNoneException();
    }
    const index = session.questionNumber;

    if (session.questionList[index] == undefined) {
      throw new QuestionNoneException();
    }
    const question = session.questionList[index];

    if (
      this.answerMapper.mapAnswersStudentDtos(question.answers) == undefined
    ) {
      throw new AnswersNoneException();
    }

    return question;
  }

  async saveAnswer(idSession: string, idAnswer: number, username: string) {
    if (this.sessionMap.get(idSession) == undefined) {
      throw new IdSessionNoneException();
    }

    const session = this.sessionMap.get(idSession);
    const question = session.questionList[session.questionNumber];

    if (!session.connectedUser.has(username)) {
      throw new UserUnknownException();
    }
    if (
      !(await this.questionService.checkQuestionContainingAnswer(
        question,
        idAnswer,
      ))
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
