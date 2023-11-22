import { Test, TestingModule } from '@nestjs/testing';
import { SessionService } from './session.service';
import { QuestionService } from '../../question/service/question.service';
import { AnswerMapper } from '../../question/mapper/answer.mapper';
import { EventService } from '../../event/service/event.service';
import { Session } from '../session';
import { Question } from '../../question/entity/question.entity';
import { IdSessionNoneException } from '../exception/idSessionNone.exception';
import { AnswersNoneException } from '../exception/answersNone.exception';

describe('SessionService', () => {
  let service: SessionService;
  let questionService: QuestionService;
  let answerMapper: AnswerMapper;
  let eventService: EventService;
  let sessionMap: Map<string, Session>;

  const mockQuestionService = {
    createQuestion: jest.fn(),
    deleteQuestions: jest.fn(),
    deleteQuestion: jest.fn(),
    findQuestion: jest.fn(),
    modifyQuestion: jest.fn(),
    findAllWithQuestion: jest.fn(),
  };

  const mockMap = {
    set: jest.fn(),
    get: jest.fn(),
  };

  const mockAnswerMapper = {
    mapAnswersStudentDtos: jest.fn(),
  };

  const mockEventService = {
    createClientGroup: jest.fn(),
    sendEvent: jest.fn(),
    closeClientGroup: jest.fn(),
  };

  const session: Session = {
    id: '111111',

    questionList: [
      {
        id: 1,
        content: 'Exemple de contenu',
        answers: [
          {
            id: 1,
            content: 'Exemple de réponse',
            isCorrect: false,
            question: null,
          },
        ],
        questionnary: {
          id: 1,
          title: 'testQuestionnary',
          author: 'authorTest',
          questions: null,
        },
      },
    ],

    questionNumber: 1,

    connectedUser: null,

    userAnswers: null,

    endSession: false,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionService,
        {
          provide: QuestionService,
          useValue: mockQuestionService,
        },
        {
          provide: AnswerMapper,
          useValue: mockAnswerMapper,
        },
        {
          provide: EventService,
          useValue: mockEventService,
        },
        {
          provide: Map<string, Session>,
          useValue: mockMap,
        },
      ],
    }).compile();

    service = module.get<SessionService>(SessionService);
    answerMapper = module.get<AnswerMapper>(AnswerMapper);
    questionService = module.get<QuestionService>(QuestionService);
    eventService = module.get<EventService>(EventService);
    sessionMap = module.get<Map<string, Session>>(Map<string, Session>);
  });

  describe('initializeSession', () => {
    it('generate idSession : should be returned an idSession, should be a STRING', async () => {
      const test = await service.generateIdSession();
      expect(typeof test).toBe('string');
      expect(test.length).toEqual(6);
      expect(typeof test).not.toBe('Integer');
    });
    it('initializeSession : should be not equal to the empty session', async () => {
      const testSession = await service.initializeSession();
      expect(testSession).not.toEqual(session);
      expect(testSession).toBeInstanceOf(Session);
      expect(testSession.id).not.toBeNull();
      expect(testSession.id).not.toMatch(/[a-zA-ZÀ-ÿ]/);
    });
  });

  describe('CreateSession', () => {
    it('should create a session and return a Session', async () => {
      let test = await service.createSession(service.generateIdSession());
      expect(test).toBeInstanceOf(Session);
      expect(typeof test.id).toBe('string');
    });
  });

  describe('nextQuestion', () => {
    it('should return the next question', async () => {
      mockMap.get.mockReturnValue(session);

      const mockSessionMap = new Map<string, Session>();
      mockSessionMap.set('111111', session);
      (service as any).sessionMap = mockSessionMap;

      let test = service.nextQuestion('111111');
      expect(test).toBeNull();
      expect(test).not.toEqual(session);
      let session2: Session = session;
      let quest = new Question();
      quest.answers = [];
      session2.questionList[1] = quest;

      session2.questionNumber = 0;
      mockSessionMap.set('111111', session2);
      (service as any).sessionMap = mockSessionMap;
      let test2 = service.nextQuestion('111111');

      expect(test2).toBeInstanceOf(Question);
      expect(test2).toEqual(quest);

      expect(() => service.nextQuestion('111112')).toThrow(
        IdSessionNoneException,
      );
    });
  });
  describe('currentQuestion', () => {
    it('should return the current question', async () => {
      const mockSessionMap = new Map<string, Session>();
      mockSessionMap.set('111111', session);
      (service as any).sessionMap = mockSessionMap;

      let session2: Session = session;
      let quest = new Question();
      quest.answers = [];
      session2.questionList[1] = quest;

      expect(() => service.currentQuestion('111111')).toThrow(
        AnswersNoneException,
      );

      mockAnswerMapper.mapAnswersStudentDtos.mockResolvedValue(
        new AnswerMapper(),
      );
      let test = service.currentQuestion('111111');
      expect(test).toBeInstanceOf(Question);
    });
  });
});
