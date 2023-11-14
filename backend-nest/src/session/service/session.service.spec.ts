import { Test, TestingModule } from '@nestjs/testing';
import { SessionService } from './session.service';
import { QuestionService } from '../../question/service/question.service';
import { AnswerMapper } from '../../question/mapper/answer.mapper';
import { EventService } from '../../event/service/event.service';
import { Session } from '../session';
import { Question } from '../../question/entity/question.entity';
import { Answer } from '../../question/entity/answer.entity';

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
  };

  const mockAnswerMapper = {};

  const mockEventService = {
    createClientGroup: jest.fn(),
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
          provide: Map,
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
      let test = await service.generateIdSession();
      expect(typeof test).toBe('string');
    });
    it('initializeSession : should be not equal to the empty session', async () => {
      //let sessionMap: Map<string, Session> = new Map<string, Session>();
      let session = {
        id: '111111',

        questionList: null,

        questionNumber: 5,

        connectedUser: null,

        userAnswers: null,

        endSession: false,
      };
      //sessionMap.set('111111', session);
      //mockMap.set.mockResolvedValue("111111", session);
      //mockMap.set.mockResolvedValue(null);
      let testSession = await service.initializeSession();
      expect(testSession).not.toEqual(session);
    });
  });
});
