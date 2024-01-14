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
import { EventParticipantEnum } from '../../event/enum/eventParticipant.enum';
import { EventService } from '../../event/service/event.service';
import { Teacher } from '../../user/entity/teacher.entity';
import { ParticipantInterface } from '../../user/interface/participant.interface';
import { Questionnary } from '../../questionnary/entity/questionnary.entity';
import { QuestionType } from '../../question/constants/questionType.constant';
import { AccessTypeEnum } from '../enum/accessType.enum';
import { AccessDto } from '../dto/access.dto';
import { SessionClosedException } from '../exception/sessionClosed.exception';
import { UserNotInWhitelistException } from '../exception/userNotInWhitelist.exception';
import { EventHostEnum } from '../../event/enum/eventHost.enum';

@Injectable()
export class SessionService {
  private sessionMap: Map<string, Session> = new Map<string, Session>();
  constructor(
    private questionService: QuestionService,
    private questionnaryService: QuestionnaryService,
    private answerMapper: AnswerMapper,
    private eventService: EventService,
  ) {}

  async initializeSession(teacher: Teacher, ids: number[]): Promise<Session> {
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
      await this.createSession(idSession, teacher, questionnaries),
    );
    this.eventService.createSessionGroup(idSession, teacher.id);
    return this.sessionMap.get(idSession);
  }

  generateIdSession(): string {
    //TODO change to 6 characters
    return Math.floor(Math.random() * (1000000 - 100000) + 100000).toString(); // nombre aléatoire de 6 chiffres
  }

  async createSession(
    idSession: string,
    teacher: Teacher,
    questionnaryTab: Questionnary[],
  ): Promise<Session> {
    return new Session(idSession, questionnaryTab, teacher);
  }

  startSession(idSession: string): boolean {
    return this.sessionMap.has(idSession);
  }

  async nextQuestion(idSession: string): Promise<boolean> {
    const currentSession = this.sessionMap.get(idSession);
    // check for next question in the current questionnary
    if (currentSession.endSession) return false;
    if (
      currentSession.questionNumber + 1 <
      (
        await this.questionnaryService.findQuestionsFromIdQuestionnary(
          currentSession.questionnaryList[currentSession.questionnaryNumber].id,
        )
      ).length
    ) {
      currentSession.questionNumber = currentSession.questionNumber + 1;
      this.eventService.sendEvent(
        EventParticipantEnum.NEXT_QUESTION,
        idSession,
      );
      return true;
      // else check for next questionnary in the current session
    } else if (
      currentSession.questionnaryNumber + 1 <
      currentSession.questionnaryList.length
    ) {
      currentSession.questionnaryNumber = currentSession.questionnaryNumber + 1;
      currentSession.questionNumber = 0;
      this.eventService.sendEvent(
        EventParticipantEnum.NEXT_QUESTION,
        idSession,
      );
      return true;
    }
    this.eventService.sendEvent(EventParticipantEnum.END_SESSION, idSession);
    currentSession.endSession = true;
    this.eventService.closeSessionGroup(idSession);
    return false;
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

  join(idSession: string, user: ParticipantInterface): void {
    if (this.sessionMap.has(idSession) == false) {
      throw new IdSessionNoneException();
    }
    const session = this.sessionMap.get(idSession);

    if (session.accessType == AccessTypeEnum.Public) {
      if (session.connectedUser.has(user)) {
        throw new UserAlreadyJoinedException();
      }
      this.joinParticipant(session, user);
    } else if (
      session.accessType == AccessTypeEnum.Private &&
      session.whitelist.includes(user.id)
    ) {
      if (session.connectedUser.has(user)) {
        throw new UserAlreadyJoinedException();
      }
      this.joinParticipant(session, user);
    } else if (
      session.accessType == AccessTypeEnum.Private &&
      !session.whitelist.includes(user.id)
    ) {
      throw new UserNotInWhitelistException();
    } else {
      throw new SessionClosedException();
    }
  }

  joinParticipant(session: Session, user: ParticipantInterface): void {
    session.connectedUser.add(user);
    session.userAnswers.set(user.id, new Map<Question, Answer>());
    this.eventService.sendHostEventWithPayload(
      EventHostEnum.NEW_CONNECTION,
      session.id,
      user,
    );
  }

  async currentQuestion(idSession: string) {
    const session = this.getSessionOrThrow(idSession);
    const question = await this.getCurrentQuestion(session);

    if (
      this.answerMapper.mapAnswersStudentDtos(question.answers) == undefined
    ) {
      throw new AnswersNoneException();
    }

    return question;
  }

  async saveAnswer(
    idSession: string,
    idAnswer: number | string | number[],
    user: ParticipantInterface,
  ) {
    const session = this.getSessionOrThrow(idSession);
    const question = await this.getCurrentQuestion(session);

    if (!session.hasUser(user)) {
      throw new UserUnknownException();
    }

    if (
      (typeof idAnswer === 'number' &&
        !(await this.questionService.checkQuestionContainingAnswer(
          question,
          idAnswer,
        ))) ||
      (Array.isArray(idAnswer) &&
        !idAnswer.every((num) => typeof num === 'number'))
    ) {
      throw new AnswerNotOfCurrentQuestionException();
    }
    const answer = Array.isArray(idAnswer)
      ? question.answers.filter((answer) => idAnswer.includes(answer.id))
      : typeof idAnswer === 'number'
      ? question.answers.find((answer) => answer.id === idAnswer)
      : question.type === QuestionType.QOC
      ? idAnswer.split(/[ _]/)[0]
      : idAnswer;
    session.userAnswers.get(user.id).set(question, answer);
    this.sendSaveAnswerEvent(session, answer, user);
  }

  sendSaveAnswerEvent(
    session: Session,
    answer: string | Answer | Answer[],
    user: ParticipantInterface,
  ) {
    this.eventService.sendHostEventWithPayload(
      EventHostEnum.NEW_ANSWER,
      session.id,
      {
        user: user,
        answer: answer,
      },
    );
  }

  getMapUser(idSession: string) {
    //map userAnswers with connectedUser
    const session = this.sessionMap.get(idSession);
    const mapUser = new Map<
      ParticipantInterface,
      Map<Question, Answer | string | Answer[]>
    >();
    for (const user of session.connectedUser) {
      mapUser.set(user, session.userAnswers.get(user.id));
    }
    return mapUser;
  }

  isHost(idSession: string, teacher: Teacher): boolean {
    return (
      this.sessionMap.get(idSession) != undefined &&
      this.sessionMap.get(idSession).host.id == teacher.id
    );
  }

  isParticipant(idSession: string, user: ParticipantInterface): boolean {
    return (
      this.sessionMap.get(idSession) != undefined &&
      this.sessionMap.get(idSession).hasUser(user)
    );
  }

  async getCurrentQuestion(session: Session) {
    const questionTab =
      await this.questionnaryService.findQuestionsFromIdQuestionnary(
        session.questionnaryList[session.questionnaryNumber].id,
      );
    return await this.questionService.findQuestion(
      questionTab[session.questionNumber].id,
    );
  }

  getSessionOrThrow(idSession: string) {
    if (this.sessionMap.get(idSession) == undefined) {
      throw new IdSessionNoneException();
    }
    return this.sessionMap.get(idSession);
  }

  setSettings(access: AccessDto, idSession: string) {
    const session = this.sessionMap.get(idSession);
    if (!!session) {
      session.accessType = access.accesType;
      session.whitelist = access.whitelist;
    }

    return !!session;
  }
}
