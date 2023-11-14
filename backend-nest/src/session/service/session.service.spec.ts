import { Test, TestingModule } from '@nestjs/testing';
import { SessionService } from './session.service';
import { QuestionService } from '../../question/service/question.service';
import { AnswerMapper } from '../../question/mapper/answer.mapper';
import { EventService } from '../../event/service/event.service';

describe('SessionService', () => {
  let service: SessionService;
  let questionService: QuestionService;
  let answerMapper: AnswerMapper;
  let eventService: EventService;

  const mockQuestionService = {
    createQuestion: jest.fn(),
    deleteQuestions: jest.fn(),
    deleteQuestion: jest.fn(),
    findQuestion: jest.fn(),
    modifyQuestion: jest.fn(),
  };

  const mockAnswerMapper = {};

  const mockEventService = {};

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
      ],
    }).compile();

    service = module.get<SessionService>(SessionService);
    answerMapper = module.get<AnswerMapper>(AnswerMapper);
    questionService = module.get<QuestionService>(QuestionService);
    eventService = module.get<EventService>(EventService);
  });

  describe('CreateSession', () => {
    it('generate idSession : should be returned an idSession, should be a STRING', async () => {
      let test = await service.generateIdSession();
      expect(typeof test).toBe('string');
    });
    it('initializeSession : should be returned an idSession, should be a STRING', async () => {
      let test = await service.generateIdSession();
      expect(typeof test).toBe('string');
    });
  });
});
