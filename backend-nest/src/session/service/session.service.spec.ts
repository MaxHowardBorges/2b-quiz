import { SessionService } from './session.service';
import { QuestionService } from '../../question/service/question.service';
import { AnswerMapper } from '../../question/mapper/answer.mapper';
import { EventService } from '../../event/service/event.service';
import { SessionTemp } from '../temp/sessionTemp';
import { Questionnary } from '../../questionnary/entity/questionnary.entity';
import { QuestionnaryService } from '../../questionnary/service/questionnary.service';
import {
  generateRandomParticipantMockList,
  generateStudentMock,
  generateTeacherMock,
} from '../../../test/mock/user.mock';
import { TestBed } from '@automock/jest';
import { UserService } from '../../user/service/user.service';
import { SessionMapper } from '../mapper/session.mapper';
import { Repository } from 'typeorm';
import { Session } from '../entity/session.entity';
import { UserSession } from '../entity/userSession.entity';
import { generateQuestionnaryMock } from '../../../test/mock/questionnary.mock';
import { Teacher } from '../../user/entity/teacher.entity';
import {
  generateSessionMock,
  generateSessionTempMock,
  generateSettingsMock,
  generateUserSessionMock,
} from '../../../test/mock/session.mock';
import { AccessTypeEnum } from '../enum/accessType.enum';
import { ParticipantInterface } from '../../user/interface/participant.interface';
import { EventHostEnum } from '../../event/enum/eventHost.enum';
import { IdSessionNoneException } from '../exception/idSessionNone.exception';
import { DisplaySettingsObject } from '../object/displaySettings.object';
import { User } from '../../user/entity/user.entity';
import { Student } from '../../user/entity/student.entity';
import { EventParticipantEnum } from '../../event/enum/eventParticipant.enum';

describe('SessionService', () => {
  let service: SessionService;
  let questionService: jest.Mocked<QuestionService>;
  let questionnaryService: jest.Mocked<QuestionnaryService>;
  let userService: jest.Mocked<UserService>;
  let answerMapper: jest.Mocked<AnswerMapper>;
  let eventService: jest.Mocked<EventService>;
  let sessionMapper: jest.Mocked<SessionMapper>;
  let sessionRepository: jest.Mocked<Repository<Session>>;
  let userSessionRepository: jest.Mocked<Repository<UserSession>>;
  let sessionMap: Map<string, SessionTemp>;

  let teacherMock: Teacher;
  let questionnaryMock: Questionnary;
  let sessionTempMock: SessionTemp;
  let sessionMock: Session;
  let participantMock: ParticipantInterface[];

  beforeAll(() => {
    const { unit, unitRef } = TestBed.create(SessionService).compile();

    service = unit;
    questionService = unitRef.get(QuestionService);
    questionnaryService = unitRef.get(QuestionnaryService);
    userService = unitRef.get(UserService);
    answerMapper = unitRef.get(AnswerMapper);
    eventService = unitRef.get(EventService);
    sessionMapper = unitRef.get(SessionMapper);
    sessionRepository = unitRef.get('SessionRepository');
    userSessionRepository = unitRef.get('UserSessionRepository');
  });

  beforeEach(() => {
    teacherMock = generateTeacherMock();
    questionnaryMock = generateQuestionnaryMock(teacherMock);
    participantMock = generateRandomParticipantMockList(5);
    sessionTempMock = generateSessionTempMock(
      AccessTypeEnum.Public,
      participantMock,
    );
    sessionMock = generateSessionMock(sessionTempMock);
  });

  // initializeSession
  describe('initializeSession', () => {
    it('should initialize a session', async () => {
      sessionTempMock.questionnary = questionnaryMock;
      eventService.createSessionGroup.mockReturnValue(null);

      const session = await service.initializeSession(
        sessionTempMock.host,
        [questionnaryMock.id],
        sessionTempMock.settings,
        sessionTempMock.whitelist,
        sessionTempMock.whitelistGroups,
      );
      sessionTempMock.questionnary = undefined;
      sessionTempMock.id = session.id;

      expect(session).toEqual(sessionTempMock);
    });
  });

  //generateIdSession
  describe('generateIdSession', () => {
    it('should generate an id session', () => {
      const idSession = service.generateIdSession();
      expect(idSession).toBeDefined();
    });
  });

  //createSession
  describe('createSession', () => {
    it('should create a session', async () => {
      const session = await service.createSession(
        sessionTempMock.id,
        sessionTempMock.host,
        sessionTempMock.questionnary,
        sessionTempMock.settings,
        sessionTempMock.whitelist,
        sessionTempMock.whitelistGroups,
      );
      expect(session).toEqual(sessionTempMock);
      expect(session).toBeInstanceOf(SessionTemp);
    });
  });

  //isSessionExists
  describe('isSessionExists', () => {
    it('should return true if session exist', async () => {
      sessionMap = new Map<string, SessionTemp>();
      sessionMap.set(sessionTempMock.id, sessionTempMock);
      service['sessionMap'] = sessionMap;

      const isSessionExist = service.isSessionExists(sessionTempMock.id);
      expect(isSessionExist).toEqual(true);
    });

    it('should return false if session does not exist', async () => {
      sessionMap = new Map<string, SessionTemp>();
      service['sessionMap'] = sessionMap;

      const isSessionExist = service.isSessionExists(sessionTempMock.id);
      expect(isSessionExist).toEqual(false);
    });
  });

  //nextQuestion
  describe('nextQuestion', () => {
    beforeEach(() => {
      sessionTempMock.questionnary.questions = [
        sessionTempMock.questionnary.questions[0],
        sessionTempMock.questionnary.questions[1],
      ];
      questionnaryService.findQuestionsFromIdQuestionnary.mockResolvedValue(
        sessionTempMock.questionnary.questions,
      );
    });
    it('should return true if there is the next question', async () => {
      sessionTempMock.questionNumber = 0;
      sessionMap = new Map<string, SessionTemp>();
      sessionMap.set(sessionTempMock.id, sessionTempMock);
      service['sessionMap'] = sessionMap;
      const question = await service.nextQuestion(sessionTempMock.id);
      expect(question).toBeTruthy();
    });

    it('should return false if there is no next question', async () => {
      sessionTempMock.questionNumber = 1;
      sessionMap = new Map<string, SessionTemp>();
      sessionMap.set(sessionTempMock.id, sessionTempMock);
      service['sessionMap'] = sessionMap;
      const question = await service.nextQuestion(sessionTempMock.id);
      expect(question).toBeFalsy();
    });
  });

  //join
  describe('join', () => {
    it('should join a session', async () => {
      sessionMap = new Map<string, SessionTemp>();
      sessionMap.set(sessionTempMock.id, sessionTempMock);
      service['sessionMap'] = sessionMap;
      service.join(sessionTempMock.id, participantMock[0]);
      expect(sessionTempMock.connectedUser.size).toEqual(1);
    });
  });

  //joinParticipant
  describe('joinParticipant', () => {
    it('should join a session', async () => {
      sessionMap = new Map<string, SessionTemp>();
      sessionMap.set(sessionTempMock.id, sessionTempMock);
      service['sessionMap'] = sessionMap;
      service.joinParticipant(sessionTempMock, participantMock[0]);
      expect(sessionTempMock.connectedUser.size).toEqual(1);
    });
  });

  //currentQuestion
  describe('currentQuestion', () => {
    it('should return the current question', async () => {
      sessionMap = new Map<string, SessionTemp>();
      sessionMap.set(sessionTempMock.id, sessionTempMock);
      sessionTempMock.questionnary.questions[0].id = 1;
      sessionTempMock.questionNumber = 0;
      service['sessionMap'] = sessionMap;
      questionnaryService.findQuestionsFromIdQuestionnary.mockResolvedValue(
        sessionTempMock.questionnary.questions,
      );
      answerMapper.mapAnswersStudentDtos.mockReturnValue(
        sessionTempMock.questionnary.questions[0].answers,
      );
      questionService.findQuestion.mockResolvedValue(
        sessionTempMock.questionnary.questions[0],
      );
      const question = await service.currentQuestion(sessionTempMock.id);
      expect(question).toEqual(sessionTempMock.questionnary.questions[0]);
    });
  });

  //saveAnswer
  describe('saveAnswer', () => {
    it('should save an answer', async () => {
      sessionMap = new Map<string, SessionTemp>();
      sessionMap.set(sessionTempMock.id, sessionTempMock);
      service['sessionMap'] = sessionMap;
      sessionTempMock.questionnary.questions[0].id = 1;
      sessionTempMock.questionNumber = 0;
      service.join(sessionTempMock.id, participantMock[0]);
      questionService.findQuestion.mockResolvedValue(
        sessionTempMock.questionnary.questions[0],
      );
      answerMapper.mapAnswerStudentDto.mockReturnValue(
        sessionTempMock.questionnary.questions[0].answers[0],
      );
      questionnaryService.findQuestionsFromIdQuestionnary.mockResolvedValue(
        sessionTempMock.questionnary.questions,
      );
      questionService.checkQuestionContainingAnswer.mockResolvedValue(true);
      questionService.createAnswerOpenEnded.mockResolvedValue(
        sessionTempMock.questionnary.questions[0].answers[0],
      );
      await service.saveAnswer(
        sessionTempMock.id,
        sessionTempMock.questionnary.questions[0].answers[0].id,
        participantMock[0],
      );
      expect(sessionTempMock.userAnswers.size).toEqual(1);
    });
  });

  //sendSaveAnswerEvent
  describe('sendSaveAnswerEvent', () => {
    it('should send an event', async () => {
      sessionMap = new Map<string, SessionTemp>();
      sessionMap.set(sessionTempMock.id, sessionTempMock);
      service['sessionMap'] = sessionMap;
      sessionTempMock.questionnary.questions[0].id = 1;
      sessionTempMock.questionNumber = 0;
      service.join(sessionTempMock.id, participantMock[0]);
      questionService.findQuestion.mockResolvedValue(
        sessionTempMock.questionnary.questions[0],
      );
      answerMapper.mapAnswerStudentDto.mockReturnValue(
        sessionTempMock.questionnary.questions[0].answers[0],
      );
      questionnaryService.findQuestionsFromIdQuestionnary.mockResolvedValue(
        sessionTempMock.questionnary.questions,
      );
      questionService.checkQuestionContainingAnswer.mockResolvedValue(true);
      questionService.createAnswerOpenEnded.mockResolvedValue(
        sessionTempMock.questionnary.questions[0].answers[0],
      );
      await service.saveAnswer(
        sessionTempMock.id,
        sessionTempMock.questionnary.questions[0].answers[0].id,
        participantMock[0],
      );
      expect(eventService.sendHostEventWithPayload).toHaveBeenCalledWith(
        EventHostEnum.NEW_ANSWER,
        sessionTempMock.id,
        {
          user: participantMock[0],
          answer: sessionTempMock.questionnary.questions[0].answers[0].id,
        },
      );
    });
  });

  //saveSession
  describe('saveSession', () => {
    it('should save a session', async () => {
      sessionMap = new Map<string, SessionTemp>();
      sessionMap.set(sessionTempMock.id, sessionTempMock);
      service['sessionMap'] = sessionMap;
      sessionRepository.save.mockResolvedValue(sessionMock);
      await service.saveSession(sessionTempMock.id);
      expect(sessionRepository.save).toHaveBeenCalled();
    });
  });

  //deleteQuestionnary
  describe('deleteQuestionnary', () => {
    it('should delete a questionnary', async () => {
      sessionTempMock.questionnary = questionnaryMock;
      sessionMap = new Map<string, SessionTemp>();
      sessionMap.set(sessionTempMock.id, sessionTempMock);
      service['sessionMap'] = sessionMap;
      await service.deleteQuestionnary(sessionTempMock.id);
      expect(questionnaryService.deleteQuestionnary).toHaveBeenCalled();
    });
  });

  //isHost
  describe('isHost', () => {
    it('should return true if user is host', async () => {
      sessionTempMock.questionnary = questionnaryMock;
      sessionMap = new Map<string, SessionTemp>();
      sessionMap.set(sessionTempMock.id, sessionTempMock);
      sessionTempMock.host = teacherMock;
      service['sessionMap'] = sessionMap;
      const isHost = service.isHost(sessionTempMock.id, teacherMock);
      expect(isHost).toEqual(true);
    });

    it('should return false if user is not host', async () => {
      const teacher = generateTeacherMock();
      const isHost = service.isHost(sessionTempMock.id, teacher);
      expect(isHost).toEqual(false);
    });
  });

  //isParticipant
  describe('isParticipant', () => {
    it('should return true if user is participant', async () => {
      sessionTempMock.questionnary = questionnaryMock;
      participantMock[0].id = 1;
      sessionMap = new Map<string, SessionTemp>();
      sessionTempMock.connectedUser.add(participantMock[0]);
      sessionMap.set(sessionTempMock.id, sessionTempMock);
      service['sessionMap'] = sessionMap;
      const isParticipant = service.isParticipant(
        sessionTempMock.id,
        participantMock[0],
      );
      expect(isParticipant).toEqual(true);
    });

    it('should return false if user is not participant', async () => {
      const teacher = generateTeacherMock();
      const isParticipant = service.isParticipant(sessionTempMock.id, teacher);
      expect(isParticipant).toEqual(false);
    });
  });

  //getCurrentQuestion
  describe('getCurrentQuestion', () => {
    it('should return the current question', async () => {
      sessionTempMock.questionnary.questions = [
        sessionTempMock.questionnary.questions[0],
        sessionTempMock.questionnary.questions[1],
      ];
      questionnaryService.findQuestionsFromIdQuestionnary.mockResolvedValue(
        sessionTempMock.questionnary.questions,
      );
      questionService.findQuestion.mockResolvedValue(
        sessionTempMock.questionnary.questions[0],
      );
      sessionTempMock.questionNumber = 0;
      sessionMap = new Map<string, SessionTemp>();
      sessionMap.set(sessionTempMock.id, sessionTempMock);
      service['sessionMap'] = sessionMap;
      const question = await service.getCurrentQuestion(sessionTempMock);
      expect(question).toEqual(sessionTempMock.questionnary.questions[0]);
      expect(questionService.findQuestion).toHaveBeenCalledWith(
        sessionTempMock.questionnary.questions[0].id,
      );
      expect(
        questionnaryService.findQuestionsFromIdQuestionnary,
      ).toHaveBeenCalledWith(sessionTempMock.questionnary.id);
    });
  });

  //getSessionOrThrow
  describe('getSessionOrThrow', () => {
    it('should return a session', async () => {
      sessionMap = new Map<string, SessionTemp>();
      sessionMap.set(sessionTempMock.id, sessionTempMock);
      service['sessionMap'] = sessionMap;

      const session = service.getSessionOrThrow(sessionTempMock.id);
      expect(session).toEqual(sessionTempMock);
    });

    it('should throw an error if session does not exist', async () => {
      sessionMap = new Map<string, SessionTemp>();
      service['sessionMap'] = sessionMap;

      expect(() => service.getSessionOrThrow(sessionTempMock.id)).toThrow(
        IdSessionNoneException,
      );
    });
  });

  //setSettings
  describe('setSettings', () => {
    it('should set settings', async () => {
      sessionMap = new Map<string, SessionTemp>();
      sessionMap.set(sessionTempMock.id, sessionTempMock);
      sessionTempMock.settings = generateSettingsMock(AccessTypeEnum.Private);
      service['sessionMap'] = sessionMap;
      service.setSettings(sessionTempMock.id, sessionTempMock.settings);
      expect(sessionTempMock.settings).toEqual(sessionTempMock.settings);
    });
  });

  //addToWhitelist
  describe('addToWhitelist', () => {
    it('should add a user to whitelist', async () => {
      sessionMap = new Map<string, SessionTemp>();
      sessionMap.set(sessionTempMock.id, sessionTempMock);
      sessionTempMock.whitelist = [];
      service['sessionMap'] = sessionMap;

      service.addToWhitelist(sessionTempMock.id, [1]);
      expect(sessionTempMock.whitelist).toEqual([1]);
    });
  });

  //getDisplaySettings
  describe('getDisplaySettings', () => {
    it('should return display settings', async () => {
      sessionMap = new Map<string, SessionTemp>();
      sessionMap.set(sessionTempMock.id, sessionTempMock);
      service['sessionMap'] = sessionMap;

      const displaySettings = service.getDisplaySettings(sessionTempMock.id);
      expect(displaySettings).toEqual(sessionTempMock.settings.displaySettings);
    });
  });

  //setDisplaySettings
  describe('setDisplaySettings', () => {
    it('should set display settings', async () => {
      sessionMap = new Map<string, SessionTemp>();
      sessionMap.set(sessionTempMock.id, sessionTempMock);
      sessionTempMock.settings.displaySettings = new DisplaySettingsObject(
        true,
        true,
      );
      service['sessionMap'] = sessionMap;

      service.setDisplaySettings(
        sessionTempMock.id,
        sessionTempMock.settings.displaySettings,
      );
      expect(sessionTempMock.settings.displaySettings).toEqual(
        sessionTempMock.settings.displaySettings,
      );
    });
  });

  //getSessionStatus
  describe('getSessionStatus', () => {
    it('should return session status', async () => {
      sessionMap = new Map<string, SessionTemp>();
      sessionMap.set(sessionTempMock.id, sessionTempMock);
      service['sessionMap'] = sessionMap;

      const sessionStatus = service.getSessionStatus(sessionTempMock.id);
      expect(sessionStatus).toEqual(sessionTempMock);
    });
    it('should return null if session does not exist', async () => {
      sessionMap = new Map<string, SessionTemp>();
      service['sessionMap'] = sessionMap;

      const sessionStatus = service.getSessionStatus(sessionTempMock.id);
      expect(sessionStatus).toEqual(null);
    });
  });

  //isStarted
  describe('isStarted', () => {
    it('should return true if session is started', async () => {
      sessionMap = new Map<string, SessionTemp>();
      sessionMap.set(sessionTempMock.id, sessionTempMock);
      sessionTempMock.questionNumber = 0;
      service['sessionMap'] = sessionMap;

      const isStarted = service.isStarted(sessionTempMock.id);
      expect(isStarted).toEqual(true);
    });

    it('should return false if session is not started', async () => {
      sessionMap = new Map<string, SessionTemp>();
      sessionMap.set(sessionTempMock.id, sessionTempMock);
      sessionTempMock.questionNumber = -1;
      service['sessionMap'] = sessionMap;

      const isStarted = service.isStarted(sessionTempMock.id);
      expect(isStarted).toEqual(false);
    });
  });

  //getListSession
  describe('getListSession', () => {
    it('should return list of session', async () => {
      sessionRepository.find.mockResolvedValue([sessionMock]);
      const sessionList = await service.getListSession(teacherMock);
      expect(sessionList).toEqual([sessionMock]);
    });
  });

  //getSession
  describe('getSession', () => {
    it('should return a session', async () => {
      sessionRepository.findOne.mockResolvedValue(sessionMock);
      const session = await service.getSession(sessionMock.id);
      expect(session).toEqual(sessionMock);
    });
  });

  //isHostOfSession
  describe('isHostOfSession', () => {
    it('should return true if user is host of session', async () => {
      teacherMock.id = 1;
      sessionMock.teacher = teacherMock;
      sessionRepository.findOne.mockResolvedValue(sessionMock);
      const isHostOfSession = await service.isHostOfSession(
        sessionMock.id,
        teacherMock,
      );
      expect(isHostOfSession).toEqual(true);
    });
    it('should return false if user is not host of session', async () => {
      sessionRepository.findOne.mockResolvedValue(sessionMock);
      const teacher = generateTeacherMock();
      const isHostOfSession = await service.isHostOfSession(
        sessionMock.id,
        teacher,
      );
      expect(isHostOfSession).toEqual(false);
    });
  });

  //isParticipantOfSession
  describe('isParticipantOfSession', () => {
    it('should return true if user is participant of session', async () => {
      const student = generateStudentMock();
      student.id = 1;
      sessionMock.userSession = [];
      sessionMock.userSession[0] = new UserSession();
      sessionMock.userSession[0].student = student;
      sessionRepository.findOne.mockResolvedValue(sessionMock);
      const isParticipantOfSession = await service.isParticipantOfSession(
        sessionMock.id,
        student,
      );
      expect(isParticipantOfSession).toEqual(true);
    });
    it('should return false if user is not participant of session', async () => {
      sessionRepository.findOne.mockResolvedValue(sessionMock);
      const teacher = generateTeacherMock();
      const isParticipantOfSession = await service.isParticipantOfSession(
        sessionMock.id,
        teacher,
      );
      expect(isParticipantOfSession).toEqual(false);
    });
  });

  //getResults
  describe('getResults', () => {
    it('should return results', async () => {
      teacherMock.id = 1;
      sessionRepository.findOne.mockResolvedValue(sessionMock);
      sessionMock.questionnary.id = 1;
      questionnaryService.findQuestionnary.mockResolvedValue(
        sessionMock.questionnary,
      );
      const results = await service.getResults(sessionMock.id, teacherMock);
      expect(results).toBeDefined();
    });
  });

  //getResultsForHost
  describe('getResultsForHost', () => {
    it('should return results for host', async () => {
      sessionRepository.findOne.mockResolvedValue(sessionMock);
      const results = await service.getResultsForHost(sessionMock.id);
      expect(results).toBeDefined();
    });
  });

  //getResultSettings
  describe('getResultSettings', () => {
    it('should return result settings', async () => {
      sessionRepository.findOne.mockResolvedValue(sessionMock);
      const resultSettings = await service.getResultSettings(sessionMock.id);
      expect(resultSettings).toBeDefined();
      expect(resultSettings).toEqual({
        isResult: sessionMock.isResult,
        isGlobal: sessionMock.isGlobal,
        isResponses: sessionMock.isResponses,
      });
    });
  });

  //percentSuccess
  describe('percentSuccess', () => {
    it('should return percent success', async () => {
      sessionRepository.findOne.mockResolvedValue(sessionMock);
      sessionMock.userSession.push(
        generateUserSessionMock(participantMock[0], sessionTempMock),
      );
      const percentSuccess = service['percentSuccess'](
        sessionMock.questionnary.questions[0],
        sessionMock.userSession[0],
      );
      expect(percentSuccess).toBeDefined();
    });
  });

  //stopSession
  describe('stopSession', () => {
    it('should stop session', async () => {
      sessionMap = new Map<string, SessionTemp>();
      sessionMap.set(sessionTempMock.id, sessionTempMock);
      service['sessionMap'] = sessionMap;

      await service.stopSession(sessionTempMock.id);
      expect(eventService.sendEvent).toHaveBeenCalledWith(
        EventParticipantEnum.PREMATURE_END_SESSION,
        sessionTempMock.id,
      );
      expect(sessionTempMock.endSession).toEqual(true);
      expect(eventService.closeSessionGroup).toHaveBeenCalledWith(
        sessionTempMock.id,
      );
    });
  });

  //getSessionWhereUserIsInWhitelist
  describe('getSessionWhereUserIsInWhitelist', () => {
    it('should return session where user is in whitelist', async () => {
      sessionMap = new Map<string, SessionTemp>();
      sessionMap.set(sessionTempMock.id, sessionTempMock);
      service['sessionMap'] = sessionMap;
      sessionTempMock.whitelist = [1];
      teacherMock.id = 1;
      const session =
        await service.getSessionWhereUserIsInWhitelist(teacherMock);
      expect(session).toEqual([sessionTempMock]);
    });
  });
});
