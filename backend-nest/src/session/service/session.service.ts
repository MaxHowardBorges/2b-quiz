import { Injectable } from '@nestjs/common';
import { SessionTemp } from '../temp/sessionTemp';
import { QuestionService } from '../../question/service/question.service';
import { QuestionnaryService } from '../../questionnary/service/questionnary.service';
import { Question } from '../../question/entity/question.entity';
import { AnswerNotOfCurrentQuestionException } from '../exception/answerNotOfCurrentQuestion.exception';
import { UserUnknownException } from '../exception/userUnknown.exception';
import { IdSessionNoneException } from '../exception/idSessionNone.exception';
import { AnswersNoneException } from '../exception/answersNone.exception';
import { AnswerMapper } from '../../question/mapper/answer.mapper';
import { Answer } from '../../question/entity/answer.entity';
import { EventParticipantEnum } from '../../event/enum/eventParticipant.enum';
import { EventService } from '../../event/service/event.service';
import { Teacher } from '../../user/entity/teacher.entity';
import { ParticipantInterface } from '../../user/interface/participant.interface';
import { Questionnary } from '../../questionnary/entity/questionnary.entity';
import { QuestionType } from '../../question/constants/questionType.constant';
import { AccessTypeEnum } from '../enum/accessType.enum';
import { SessionClosedException } from '../exception/sessionClosed.exception';
import { UserNotInWhitelistException } from '../exception/userNotInWhitelist.exception';
import { EventHostEnum } from '../../event/enum/eventHost.enum';
import { SettingsObject } from '../object/settings.object';
import { DisplaySettingsObject } from '../object/displaySettings.object';
import { EventObserverEnum } from '../../event/enum/eventObserver.enum';
import { Session } from '../entity/session.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserSession } from '../entity/userSession.entity';
import { Student } from '../../user/entity/student.entity';
import { SessionMapper } from '../mapper/session.mapper';
import { User } from '../../user/entity/user.entity';
import { ResultsDto } from '../dto/results.dto';
import { SettingsInSessionDto } from '../dto/settingsInSession.dto';
import { ResultsHostDto } from '../dto/resultsHost.dto';

@Injectable()
export class SessionService {
  private sessionMap: Map<string, SessionTemp> = new Map<string, SessionTemp>();
  constructor(
    private questionService: QuestionService,
    private questionnaryService: QuestionnaryService,
    private answerMapper: AnswerMapper,
    private readonly sessionMapper: SessionMapper,
    private eventService: EventService,
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
    @InjectRepository(UserSession)
    private readonly userSessionRepository: Repository<UserSession>,
  ) {}

  async initializeSession(
    teacher: Teacher,
    idQuestionnaryList: number[],
    settings: SettingsObject,
    whitelist: number[] = [],
    whitelistGroups: number[] = [],
  ): Promise<SessionTemp> {
    let idSession = this.generateIdSession();
    while (this.sessionMap.has(idSession)) {
      idSession = this.generateIdSession();
    }
    const questionnary =
      await this.questionnaryService.createQuestionnaryFromIdArray(
        idQuestionnaryList,
        teacher,
      );

    //const questionnaries : Questionnary = //await this.questionnaryService.findQuestionnary(id));
    this.sessionMap.set(
      idSession,
      await this.createSession(
        idSession,
        teacher,
        questionnary,
        settings,
        whitelist,
        whitelistGroups,
      ),
    );
    this.eventService.createSessionGroup(idSession, teacher.id);
    return this.sessionMap.get(idSession);
  }

  generateIdSession(): string {
    //generate 6 characters random string A-Z 0-9
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const charactersLength = characters.length;
    for (let counter = 0; counter < 6; counter++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  async createSession(
    idSession: string,
    teacher: Teacher,
    questionnary: Questionnary,
    settings: SettingsObject,
    whitelist: number[] = [],
    whitelistGroups: number[] = [],
  ): Promise<SessionTemp> {
    const session = new SessionTemp(idSession, questionnary, teacher, settings);
    session.whitelist = whitelist;
    session.whitelistGroups = whitelistGroups;
    return session;
  }

  isSessionExists(idSession: string): boolean {
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
          currentSession.questionnary.id,
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
    const questionnary = currentSession.questionnary;
    const questionTab =
      await this.questionnaryService.findQuestionsFromIdQuestionnary(
        questionnary.id,
      );
    questionnary.questions = [];
    for (const question of questionTab) {
      questionnary.questions.push(
        await this.questionService.findQuestion(question.id),
      );
    }

    return questionnary.questions;
  }

  join(idSession: string, user: ParticipantInterface): void {
    if (!this.sessionMap.has(idSession)) {
      throw new IdSessionNoneException();
    }
    const session = this.sessionMap.get(idSession);
    switch (session.settings.accessType) {
      case AccessTypeEnum.Public:
        this.joinParticipant(session, user);
        break;
      case AccessTypeEnum.Private:
        if (session.whitelist.includes(user.id)) {
          this.joinParticipant(session, user);
        } else {
          throw new UserNotInWhitelistException();
        }
        break;
      default:
        throw new SessionClosedException();
    }
  }

  joinParticipant(session: SessionTemp, user: ParticipantInterface): void {
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
    let answerdb = new Answer();
    if (typeof idAnswer === 'string') {
      const answer = new Answer();
      if (question.type === QuestionType.QOC) {
        answer.content = idAnswer.split(/[ _]/)[0];
      } else {
        answer.content = idAnswer;
      }

      answer.isCorrect = true;
      answer.question = question;
      answerdb = await this.questionService.createAnswerOpenEnded(answer);
    }

    const answer = Array.isArray(idAnswer)
      ? question.answers.filter((answer) => idAnswer.includes(answer.id))
      : typeof idAnswer === 'number'
      ? question.answers.find((answer) => answer.id === idAnswer)
      : question.type === QuestionType.OUV
      ? answerdb
      : question.type === QuestionType.QOC
      ? answerdb //idAnswer.split(/[ _]/)[0]
      : idAnswer;
    session.userAnswers.get(user.id).set(question, answer);
    this.sendSaveAnswerEvent(session, answer, user);
  }

  sendSaveAnswerEvent(
    session: SessionTemp,
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

  //Save session into entity
  async saveSession(idSession: string) {
    const session = this.getSessionOrThrow(idSession);
    //save session into entity
    const sessionEntity = new Session();
    //Define all sessionEntity's attributes
    sessionEntity.isGlobal = session.settings.isGlobal;
    sessionEntity.isResult = session.settings.isResult;
    sessionEntity.isResponses = session.settings.isResponses;
    sessionEntity.date = new Date();
    sessionEntity.teacher = session.host;
    sessionEntity.questionnary = session.questionnary;
    await this.sessionRepository.save(sessionEntity);
    //Define each userSessionEntity for each user in session
    for (const user of session.connectedUser) {
      const userSessionEntity = new UserSession();
      userSessionEntity.session = sessionEntity;
      if (user instanceof Teacher) {
        userSessionEntity.teacher = user;
      } else if (user instanceof Student) {
        userSessionEntity.student = user;
      }
      //Define all userSessionEntity's attributes
      userSessionEntity.answer = [];
      const userAnswer = session.userAnswers.get(user.id);
      for (const [question, answer] of userAnswer) {
        if (Array.isArray(answer)) {
          for (const a of answer) {
            userSessionEntity.answer.push(a);
          }
        } else if (typeof answer === 'string') {
          const answerEntity = new Answer();
          answerEntity.question = question;
          answerEntity.content = answer;
          answerEntity.isCorrect = true;
          userSessionEntity.answer.push(answerEntity);
        } else if (answer instanceof Answer) {
          userSessionEntity.answer.push(answer);
        }
      }
      await this.userSessionRepository.save(userSessionEntity, {});
    }
  }

  //delete questionnary of a session only with idsession
  async deleteQuestionnary(idSession: string) {
    const session = this.getSessionOrThrow(idSession);
    await this.questionnaryService.deleteQuestionnary(session.questionnary.id);
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

  async getCurrentQuestion(session: SessionTemp) {
    const questionTab =
      await this.questionnaryService.findQuestionsFromIdQuestionnary(
        session.questionnary.id,
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

  setSettings(idSession: string, settings: SettingsInSessionDto) {
    const session = this.sessionMap.get(idSession);
    if (!!session) {
      session.settings.accessType = settings.accessType;
      this.setDisplaySettings(idSession, settings.displaySettings);
    }
    return !!session;
  }

  addToWhitelist(idSession: string, whitelist: number[]) {
    const session = this.sessionMap.get(idSession);
    if (!!session) {
      session.whitelist = session.whitelist.concat(whitelist);
    }
    return !!session;
  }

  getDisplaySettings(idSession: string) {
    const session = this.sessionMap.get(idSession);
    if (!!session) {
      return session.settings.displaySettings;
    }
    return null;
  }

  setDisplaySettings(
    idSession: string,
    displaySettings: DisplaySettingsObject,
  ) {
    const session = this.sessionMap.get(idSession);
    if (!!session) {
      session.settings.displaySettings = displaySettings;
      this.eventService.sendObserverEvent(
        EventObserverEnum.NEW_DISPLAY_SETTINGS,
        idSession,
      );
    }
    return !!session;
  }

  getSessionStatus(idSession: string) {
    const session = this.sessionMap.get(idSession);
    if (!!session) {
      return session;
    }
    return null;
  }

  isStarted(idSession: string) {
    const session = this.sessionMap.get(idSession);
    if (!!session) {
      return !(
        session.questionNumber === -1 && session.questionnaryNumber === 0
      );
    }
    return null;
  }

  async getListSession(user: User) {
    if (user instanceof Teacher) {
      console.log('ok');
      return this.sessionRepository.find({
        //Find all session where student is connected
        relations: {
          userSession: { student: true, teacher: true, answer: true },
          teacher: true,
        },
        where: [
          { userSession: { teacher: { id: user.id } } },
          { teacher: { id: user.id } },
          // Ajoutez ici votre deuxième condition avec le "OR"
          // Exemple: { userSession: { student: { id: user.id } } }
        ],
        order: { date: 'DESC' },
      });
    } else if (user instanceof Student) {
      return this.sessionRepository.find({
        //Find all session where student is connected
        relations: {
          userSession: { student: true, teacher: true, answer: true },
          teacher: true,
        },
        where: { userSession: { student: { id: user.id } } },
      });
    }
  }

  async getSession(idSession: number) {
    return await this.sessionRepository.findOne({
      where: {
        id: idSession,
      },
      relations: {
        questionnary: {
          questions: { answers: true },
        },
        teacher: true,
        userSession: {
          student: true,
          teacher: true,
          answer: { question: true },
        },
      },
    });
  }

  async isHostOfSession(idSession: number, user: User) {
    const session = await this.getSession(idSession);
    return session.teacher.id == user.id;
  }

  async isParticipantOfSession(idSession: number, user: User) {
    const session = await this.getSession(idSession);
    return session.userSession.some(
      (userSession) => userSession.student.id == user.id,
    );
  }

  async getResults(idSession: number, masterUser: User) {
    const session = await this.getSession(idSession);
    session.isResponses = session.isResult && session.isResponses;

    //get session's questionnary
    const questionnary = await this.questionnaryService.findQuestionnary(
      session.questionnary.id,
    );
    //get questionnary's questions
    questionnary.questions =
      await this.questionnaryService.findQuestionsFromIdQuestionnary(
        questionnary.id,
      );
    //get questionnary's questions's answers
    for (const question of questionnary.questions) {
      question.answers = await this.questionService.findAnswers(question.id);
    }

    const resultTab: ResultsDto = new ResultsDto();
    let average = 0;
    let openQuestions = 0;
    let isCurrentUser = false;
    const averagePerQuestion = [];
    for (const question of questionnary.questions) {
      averagePerQuestion.push({ question: question.id, average: 0 });
    }
    const usersSession = session.userSession;
    if (session.isResult || session.isGlobal) {
      for (const userSession of usersSession) {
        if (userSession.student.id === masterUser.id) {
          isCurrentUser = true;
          resultTab.username = userSession.student.username;
        } else {
          isCurrentUser = false;
        }
        for (const question of questionnary.questions) {
          const mappedQuestion = this.sessionMapper.mapQuestionResult(question);
          if (session.isResponses && isCurrentUser) {
            resultTab.questions.push(mappedQuestion);
          }
          if (question.type === 'ouv' || question.type === 'qoc') {
            openQuestions++;
          } else {
            const questionResult = this.percentSuccess(question, userSession);
            average += questionResult.nbCorrectAnswer;
            averagePerQuestion.find(
              (q) => q.question === question.id,
            ).average += questionResult.nbCorrectAnswer;
            if (isCurrentUser) {
              questionResult.userAnswer
                .map((userAnswer) => userAnswer.content)
                .every((userAnswer) =>
                  mappedQuestion.studentAnswers.push(userAnswer),
                );
              session.isResult
                ? (mappedQuestion.hasAnsweredCorrectly =
                    questionResult.nbCorrectAnswer == 1)
                : '';
              session.isResponses
                ? questionResult.rightAnswer
                    .map((answer) => answer.content)
                    .every((correctAnswer) =>
                      mappedQuestion.correctAnswers.push(correctAnswer),
                    )
                : '';
              resultTab.personnalResult += questionResult.nbCorrectAnswer;
            }
          }
        }
      }
    }
    session.isGlobal
      ? (resultTab.globalResult =
          (average /
            usersSession.length /
            (questionnary.questions.length - openQuestions)) *
          100)
      : '';
    if (session.isResult)
      resultTab.personnalResult =
        (resultTab.personnalResult /
          (questionnary.questions.length - openQuestions)) *
        100;
    else resultTab.personnalResult = null;
    resultTab.teacherSurname = session.teacher.surname;
    resultTab.sessionDate = session.date;
    resultTab.teacherUsername = session.teacher.username;
    if (session.isGlobal) resultTab.totalUsers = usersSession.length;
    if (session.isGlobal) resultTab.averagePerQuestion = averagePerQuestion;
    return resultTab;
  }

  async getResultsForHost(idSession: number) {
    const session = await this.getSession(idSession);

    //get session's questionnary
    const questionnary = session.questionnary;

    const resultHostTab = new ResultsHostDto();

    const usersSession = session.userSession;
    let average = 0;
    let openQuestions = 0;

    const averagePerQuestion = [];
    for (const question of questionnary.questions) {
      averagePerQuestion.push({ question: question.id, average: 0 });
    }

    for (const userSession of usersSession) {
      const userResult = new ResultsDto();

      for (const question of questionnary.questions) {
        const mappedQuestion = this.sessionMapper.mapQuestionResult(question);
        userResult.questions.push(mappedQuestion);
        if (question.type === 'ouv' || question.type === 'qoc') {
          openQuestions++;
        } else {
          const questionResult = this.percentSuccess(question, userSession);
          average += questionResult.nbCorrectAnswer;
          averagePerQuestion.find((q) => q.question === question.id).average +=
            questionResult.nbCorrectAnswer;
          questionResult.userAnswer
            .map((userAnswer) => userAnswer.content)
            .every((userAnswer) =>
              mappedQuestion.studentAnswers.push(userAnswer),
            );

          mappedQuestion.hasAnsweredCorrectly =
            questionResult.nbCorrectAnswer == 1;

          questionResult.rightAnswer
            .map((answer) => answer.content)
            .every((correctAnswer) =>
              mappedQuestion.correctAnswers.push(correctAnswer),
            );

          userResult.personnalResult += questionResult.nbCorrectAnswer;
        }
      }
      userResult.username = userSession.student.username;
      userResult.personnalResult =
        (userResult.personnalResult /
          (questionnary.questions.length - openQuestions)) *
        100;
      resultHostTab.usersResults.push(userResult);
    }
    resultHostTab.teacherUsername = session.teacher.username;
    resultHostTab.teacherSurname = session.teacher.surname;
    resultHostTab.sessionDate = session.date;
    resultHostTab.globalResult =
      (average /
        usersSession.length /
        (questionnary.questions.length - openQuestions)) *
      100;
    resultHostTab.questions = questionnary.questions;
    resultHostTab.averagePerQuestion = averagePerQuestion;
    return resultHostTab;
  }

  async getAccessSettings(idSession: number) {
    //TODO make something of this function
  }

  //Calculate the percent of success of a student
  private percentSuccess(question: Question, user: UserSession) {
    const userAnswerEveryQuestions = user.answer;
    let nbCorrectAnswer = 0;
    const userAnswer = userAnswerEveryQuestions.filter(
      (answer) => answer.question.id == question.id,
    );
    const rightAnswer = question.answers.filter((answer) => answer.isCorrect);

    if (userAnswer.length > 0) {
      if (question.type === QuestionType.QCM) {
        if (
          rightAnswer
            .map((answer) => answer.id)
            .every((idAnswerUser) =>
              userAnswer
                .map((answer) => answer.id)
                .some((idAnswerCorrect) => idAnswerCorrect === idAnswerUser),
            )
        ) {
          nbCorrectAnswer++;
        }
      } else if (userAnswer[0].isCorrect) {
        nbCorrectAnswer++;
      }
    }
    return { nbCorrectAnswer, rightAnswer, userAnswer };
  }
}
