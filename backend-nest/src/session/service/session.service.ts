import { Body, Injectable } from '@nestjs/common';
import { Session } from '../session';
import { QuestionService } from '../../question/service/question.service';
import { Question } from '../../question/entity/question.entity';
import { AnswerNotOfCurrentQuestionException } from '../exception/answerNotOfCurrentQuestion.exception';
import { UserUnknownException } from '../exception/userUnknown.exception';
import { IdSessionNoneException } from '../exception/idSessionNone.exception';
import { AnswersNoneException } from '../exception/answersNone.exception';
import { QuestionNoneException } from '../exception/questionNone.exception';
import { QuestionNumberNoneException } from '../exception/questionNumberNone.exception';
import { AnswerMapper } from '../../question/mapper/answer.mapper';
import { UserAlreadyJoinedException } from '../exception/userAlreadyJoined.exception';
import { Answer } from '../../question/entity/answer.entity';
import { EventEnum } from '../../event/enum/event.enum';
import { EventService } from '../../event/service/event.service';

@Injectable()
export class SessionService {
  private sessionMap: Map<string, Session> = new Map<string, Session>();
  constructor(
    private questionService: QuestionService,
    private answerMapper: AnswerMapper,
    private eventService: EventService,
  ) {}

  async initializeSession(): Promise<Session> {
    let idSession = this.generateIdSession();
    while (this.sessionMap.has(idSession)) {
      idSession = this.generateIdSession();
    }

    this.sessionMap.set(idSession, await this.createSession(idSession));
    return this.sessionMap.get(idSession);
  }

  generateIdSession(): string {
    //TODO change to 6 characters
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
      currentSession.questionNumber + 1 <
      currentSession.questionList.length
    ) {
      currentSession.questionNumber = currentSession.questionNumber + 1;
      this.eventService.sendEvent(EventEnum.NEXT_QUESTION, idSession.id);
      return currentSession.questionList[currentSession.questionNumber];
    }
    this.eventService.sendEvent(EventEnum.END_SESSION, idSession.id);
    return null;
  }

  getMap() {
    return [...this.sessionMap];
  }

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
}
