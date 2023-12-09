import { Injectable } from '@nestjs/common';
import { Session } from '../session';
import { QuestionService } from '../../question/service/question.service';
import { QuestionnaryService } from '../../questionnary/service/questionnary.service';
import { Question } from '../../question/entity/question.entity';
import { AnswerNotOfCurrentQuestionException } from '../exception/answerNotOfCurrentQuestion.exception';
import { UserUnknownException } from '../exception/userUnknown.exception';
import { IdSessionNoneException } from '../exception/idSessionNone.exception';
import { AnswersNoneException } from '../exception/answersNone.exception';
import { AnswerMapper } from '../../question/mapper/answer.mapper';
import { UserAlreadyJoinedException } from '../exception/userAlreadyJoined.exception';
import { Answer } from '../../question/entity/answer.entity';
import { EventEnum } from '../../event/enum/event.enum';
import { EventService } from '../../event/service/event.service';
import { Questionnary } from '../../questionnary/entity/questionnary.entity';

@Injectable()
export class SessionService {
  private sessionMap: Map<string, Session> = new Map<string, Session>();
  constructor(
    private questionService: QuestionService,
    private questionnaryService: QuestionnaryService,
    private answerMapper: AnswerMapper,
    private eventService: EventService,
  ) {}

  async initializeSession(ids: number[]): Promise<Session> {
    let idSession = this.generateIdSession();
    while (this.sessionMap.has(idSession)) {
      idSession = this.generateIdSession();
    }
    const questionnaries: Questionnary[] = [];
    for (const id of ids) {
      questionnaries.push(await this.questionnaryService.findQuestionnary(id));
    }
    this.sessionMap.set(
      idSession,
      await this.createSession(idSession, questionnaries),
    );
    this.eventService.createClientGroup(idSession);
    return this.sessionMap.get(idSession);
  }

  generateIdSession(): string {
    //TODO change to 6 characters
    return Math.floor(Math.random() * (1000000 - 100000) + 100000).toString(); // nombre aléatoire de 6 chiffres
  }

  async createSession(
    idSession: string,
    questionnaryTab: Questionnary[],
  ): Promise<Session> {
    return new Session(idSession, questionnaryTab);
  }

  async nextQuestion(idSession: string) {
    const currentSession = this.sessionMap.get(idSession);
    // check for next question in the current questionnary
    if (
      currentSession.questionNumber + 1 <
      (
        await this.questionnaryService.findQuestionsFromIdQuestionnary(
          currentSession.questionnaryList[currentSession.questionnaryNumber].id,
        )
      ).length
    ) {
      currentSession.questionNumber = currentSession.questionNumber + 1;
      this.eventService.sendEvent(EventEnum.NEXT_QUESTION, idSession);
      let questionTab =
        await this.questionnaryService.findQuestionsFromIdQuestionnary(
          currentSession.questionnaryList[currentSession.questionnaryNumber].id,
        );
      return await this.questionService.findQuestion(
        questionTab[currentSession.questionNumber].id,
      );
      // else check for next questionnary in the current session
    } else if (
      currentSession.questionnaryNumber + 1 <
      currentSession.questionnaryList.length
    ) {
      currentSession.questionnaryNumber = currentSession.questionnaryNumber + 1;
      currentSession.questionNumber = 0;
      this.eventService.sendEvent(EventEnum.NEXT_QUESTION, idSession);
      let questionTab =
        await this.questionnaryService.findQuestionsFromIdQuestionnary(
          currentSession.questionnaryList[currentSession.questionnaryNumber].id,
        );
      return await this.questionService.findQuestion(
        questionTab[currentSession.questionNumber].id,
      );
    }
    this.eventService.sendEvent(EventEnum.END_SESSION, idSession);
    currentSession.endSession = true;
    this.eventService.closeClientGroup(idSession);
    return null;
  }

  getMap() {
    return [...this.sessionMap];
  }

  async getQuestionList(idSession: string) {
    if (this.sessionMap.has(idSession) == false) {
      throw new IdSessionNoneException();
    }
    const currentSession = this.sessionMap.get(idSession);
    const questionnaries = currentSession.questionnaryList;
    for (let questionnary of questionnaries) {
      let questionTab =
        await this.questionnaryService.findQuestionsFromIdQuestionnary(
          questionnary.id,
        );
      questionnary.questions = [];
      for (let question of questionTab) {
        questionnary.questions.push(
          await this.questionService.findQuestion(question.id),
        );
      }
    }
    return questionnaries;
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

  async currentQuestion(idSession: string) {
    if (this.sessionMap.get(idSession) == undefined) {
      throw new IdSessionNoneException();
    }
    const session = this.sessionMap.get(idSession);

    const questionTab =
      await this.questionnaryService.findQuestionsFromIdQuestionnary(
        session.questionnaryList[session.questionnaryNumber].id,
      );
    const question = await this.questionService.findQuestion(
      questionTab[session.questionNumber].id,
    );

    if (
      this.answerMapper.mapAnswersStudentDtos(question.answers) == undefined
    ) {
      throw new AnswersNoneException();
    }

    return question;
  }

  async saveAnswer(
    idSession: string,
    idAnswer: number | string,
    username: string,
  ) {
    if (this.sessionMap.get(idSession) == undefined) {
      throw new IdSessionNoneException();
    }

    const session = this.sessionMap.get(idSession);
    const questionTab =
      await this.questionnaryService.findQuestionsFromIdQuestionnary(
        session.questionnaryList[session.questionnaryNumber].id,
      );
    const question = await this.questionService.findQuestion(
      questionTab[session.questionNumber].id,
    );

    if (!session.connectedUser.has(username)) {
      throw new UserUnknownException();
    }
    if (
      typeof idAnswer == 'number' &&
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

  getMapUser(idSession: string) {
    return this.sessionMap.get(idSession).userAnswers;
  }
}
