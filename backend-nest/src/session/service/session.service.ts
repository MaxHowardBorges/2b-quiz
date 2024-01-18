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
import { UserAlreadyJoinedException } from '../exception/userAlreadyJoined.exception';
import { Answer } from '../../question/entity/answer.entity';
import { EventEnum } from '../../event/enum/event.enum';
import { EventService } from '../../event/service/event.service';
import { Teacher } from '../../user/entity/teacher.entity';
import { ParticipantInterface } from '../../user/interface/participant.interface';
import { Questionnary } from '../../questionnary/entity/questionnary.entity';
import { QuestionType } from '../../question/constants/questionType.constant';
import { Session } from '../entity/session.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserSession } from '../entity/userSession.entity';
import { Student } from '../../user/entity/student.entity';
import { SessionMapper } from '../mapper/session.mapper';
import { User } from '../../user/entity/user.entity';

@Injectable()
export class SessionService {
  private sessionMap: Map<string, SessionTemp> = new Map<string, SessionTemp>();
  constructor(
    private questionService: QuestionService,
    private questionnaryService: QuestionnaryService,
    private answerMapper: AnswerMapper,
    private eventService: EventService,
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
    @InjectRepository(UserSession)
    private readonly userSessionRepository: Repository<UserSession>,
  ) {}

  async initializeSession(
    teacher: Teacher,
    idsQuestionnarys: number[],
    isResult: boolean,
    isGlobal: boolean,
    isResponses: boolean,
  ): Promise<SessionTemp> {
    let idSession = this.generateIdSession();
    while (this.sessionMap.has(idSession)) {
      idSession = this.generateIdSession();
    }
    const questionnaries: Questionnary[] = [];
    for (const id of idsQuestionnarys) {
      questionnaries.push(await this.questionnaryService.findQuestionnary(id));
    }
    this.sessionMap.set(
      idSession,
      await this.createSession(
        idSession,
        teacher,
        questionnaries,
        isResult,
        isGlobal,
        isResponses,
      ),
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
    teacher: Teacher,
    questionnaryTab: Questionnary[],
    isResult: boolean,
    isGlobal: boolean,
    isResponses: boolean,
  ): Promise<SessionTemp> {
    return new SessionTemp(
      idSession,
      questionnaryTab,
      isResult,
      isGlobal,
      isResponses,
      teacher,
    );
  }

  startSession(idSession: string): boolean {
    return this.sessionMap.has(idSession);
  }

  async nextQuestion(idSession: string) {
    const currentSession = this.sessionMap.get(idSession);
    // check for next question in the current questionnary
    if (currentSession.endSession) return null;
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

  join(idSession: string, user: ParticipantInterface): void {
    if (this.sessionMap.has(idSession) == false) {
      throw new IdSessionNoneException();
    }
    const session = this.sessionMap.get(idSession);
    if (session.connectedUser.has(user)) {
      throw new UserAlreadyJoinedException();
    }
    session.connectedUser.add(user);
    session.userAnswers.set(user.id, new Map<Question, Answer>());
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
    session.userAnswers
      .get(user.id)
      .set(
        question,
        Array.isArray(idAnswer)
          ? question.answers.filter((answer) => idAnswer.includes(answer.id))
          : typeof idAnswer === 'number'
          ? question.answers.find((answer) => answer.id === idAnswer)
          : question.type === QuestionType.QOC
          ? idAnswer.split(/[ _]/)[0]
          : idAnswer,
      );
  }

  //Save session into entity
  async saveSession(idSession: string, sessionMapper: SessionMapper) {
    const session = this.getSessionOrThrow(idSession);
    //save session into entity
    const sessionEntity = new Session();
    const userSessionEntity = new UserSession();
    //Define all sessionEntity's attributes
    sessionEntity.isGlobal = session.isGlobal;
    sessionEntity.isResult = session.isResult;
    sessionEntity.isResponses = session.isResponses;
    sessionEntity.date = new Date();
    sessionEntity.teacher = session.host;
    sessionEntity.questionnary =
      await this.questionnaryService.createQuestionnaryFromIdArray(
        session.questionnaryList,
        session.host,
      );
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
      console.log(userSessionEntity);
      await this.userSessionRepository.save(userSessionEntity, {});
    }

    console.log('bug');

    console.log('bug');
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

  async getCurrentQuestion(session: SessionTemp) {
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

  async getListSession(user: User) {
    if (user instanceof Teacher) {
      return this.sessionRepository.find({
        //Find all session where student is connected
        relations: {
          userSession: { student: true, teacher: true, answer: true },
        },
        where: {
          userSession: { teacher: { id: user.id } },
          teacher: { id: user.id },
        },
      });
    } else if (user instanceof Student) {
      return this.sessionRepository.find({
        //Find all session where student is connected
        relations: {
          userSession: { student: true, teacher: true, answer: true },
        },
        where: { userSession: { student: { id: user.id } } },
      });
    }
  }

  async getResults(idSession: number, user: User) {
    //get session with id
    const session = await this.sessionRepository.findOne({
      where: {
        id: idSession,
      },
      relations: {
        questionnary: true,
        userSession: {
          student: true,
          teacher: true,
          answer: { question: true },
        },
      },
    });

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
    questionnary.questions.map(
      async (question) =>
        (question.answers = await this.questionService.findAnswers(
          question.id,
        )),
    );
    const userSession = session.userSession;
    if (session.isResult === true) {
      //TODO
      if (session.isResponses === true) {
        //TODO
      }
    }
    if (session.isGlobal) {
      //Make an average result of all student in session
      let average = 0;
      for (const user of userSession) {
        for (const question of questionnary.questions) {
          average += this.percentSucess(question, user);
        }
      }
      average = average / userSession.length;
      return average; //TODO modify to not a return
    }
  }

  //Calculate the percent of sucess of a student
  private percentSucess(question: Question, user: UserSession) {
    const userAnswer = user.answer;
    let nbCorrectAnswer = 0; //TODO isCorrect is null
    const answer = userAnswer.filter(
      (answer) => answer.question.id == question.id,
    );
    console.log(answer);
    if (question.type === QuestionType.QCM) {
      if (answer.map((answer) => answer.isCorrect)) {
        nbCorrectAnswer++;
      }
    } else if (answer[0].isCorrect) {
      nbCorrectAnswer++;
    }
    return (nbCorrectAnswer / answer.length) * 100;
  }
}
