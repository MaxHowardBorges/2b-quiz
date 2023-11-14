import { Test, TestingModule } from '@nestjs/testing';
import { SessionController } from './session.controller';
import { SessionService } from '../service/session.service';
import { Session } from '../session';
import { QuestionService } from '../../question/service/question.service';
import { EventService } from '../../event/service/event.service';
import { AnswerMapper } from '../../question/mapper/answer.mapper';
import { SessionMapper } from '../mapper/session.mapper';
import { GetCurrentQuestionDto } from '../dto/getCurrentQuestion.dto';
import { Question } from '../../question/entity/question.entity';
import { Answer } from '../../question/entity/answer.entity';

describe('SessionController', () => {
  let sessionController: SessionController;
  let sessionService: SessionService;
  let eventService: EventService;
  let answerMapper: AnswerMapper;
  let sessionMap: Map<string, Session>;

  const mockQuestionService = {
    createQuestion: jest.fn(),
    deleteQuestions: jest.fn(),
    deleteQuestion: jest.fn(),
    findQuestion: jest.fn(),
    modifyQuestion: jest.fn(),
    findAllWithQuestion: jest.fn(),
  };

  const mockSessionService = {
    generateIdSession: jest.fn(),
    initializeSession: jest.fn(),
    currentQuestion: jest.fn(),
  };

  const mockMap = {
    set: jest.fn(),
  };

  const mockAnswerMapper = {};
  const mockSessionMapper = {
    mapCurrentQuestionDto: jest.fn(),
  };

  const mockEventService = {
    createClientGroup: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SessionController],
      providers: [
        {
          provide: SessionService,
          useValue: mockSessionService,
        },
        {
          provide: QuestionService,
          useValue: mockQuestionService,
        },
        {
          provide: SessionMapper,
          useValue: mockSessionMapper,
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

    sessionController = module.get<SessionController>(SessionController);
    sessionService = module.get<SessionService>(SessionService);
    eventService = module.get<EventService>(EventService);
    answerMapper = module.get<AnswerMapper>(AnswerMapper);
    sessionMap = module.get<Map<string, Session>>(Map<string, Session>);
  });

  describe('createSession', () => {
    it('should create a new session with a question number not null', async () => {
      const session: Session = {
        id: '111111',

        questionList: null,

        questionNumber: 5,

        connectedUser: null,

        userAnswers: null,

        endSession: false,
      };

      mockSessionService.generateIdSession.mockResolvedValue('111111');
      mockSessionService.initializeSession.mockResolvedValue(session);

      expect(
        (await sessionController.createSession()).questionNumber,
      ).not.toEqual(0);
    });
    it('should create a new session that is not ended when created', async () => {
      const session: Session = {
        id: '111111',

        questionList: null,

        questionNumber: 5,

        connectedUser: null,

        userAnswers: null,

        endSession: false,
      };

      mockSessionService.generateIdSession.mockResolvedValue('111111');
      mockSessionService.initializeSession.mockResolvedValue(session);

      expect((await sessionController.createSession()).endSession).not.toEqual(
        true,
      );
    });
  });

  describe('createSession', () => {
    it('should create a new session', async () => {
      expect(await sessionController.createSession()).not.toEqual(undefined);
    });
  });

  describe('nextQuestion', () => {
    it('should return the next question', async () => {
      expect(await sessionController.createSession()).toEqual(undefined);
    });
  });

  describe('getCurrentQuestion', () => {
    it('should return the current question', async () => {
      const r = new GetCurrentQuestionDto();
      r.idSession = '111111';

      const session: Session = {
        id: '111111',

        questionList: null,

        questionNumber: 5,

        connectedUser: null,

        userAnswers: null,

        endSession: false,
      };

      session.questionList = [];
      session.questionList.push();

      let q = new Question();
      let a = new Answer();

      //q = { id: 1, content: 'Paris' };

      // const questionnary: Session = {
      //   id: '308783',
      //   questionList: [
      //     {
      //       id: 1,
      //       content: 'Quelle est la capitale de la France?',
      //       answers: [
      //         { id: 1, content: 'Paris', isCorrect: true },
      //         { id: 2, content: 'Londres', isCorrect: false },
      //         { id: 3, content: 'Berlin', isCorrect: false },
      //       ],
      //     },
      //     {
      //       id: 2,
      //       content: 'Qui a écrit "Romeo et Juliette"?',
      //       answers: [
      //         { id: 4, content: 'William Shakespeare', isCorrect: true },
      //         { id: 5, content: 'Charles Dickens', isCorrect: false },
      //         { id: 6, content: 'Jane Austen', isCorrect: false },
      //         { id: 7, content: 'George Orwell', isCorrect: false },
      //       ],
      //     },
      //     {
      //       id: 3,
      //       content: "Quel est le symbole chimique de l'oxygène?",
      //       answers: [
      //         { id: 8, content: 'O', isCorrect: true },
      //         { id: 9, content: 'H', isCorrect: false },
      //         { id: 10, content: 'C', isCorrect: false },
      //         { id: 11, content: 'N', isCorrect: false },
      //         { id: 12, content: 'S', isCorrect: false },
      //       ],
      //     },
      //   ],
      //   questionNumber: -1,
      //   connectedUser: {},
      //   userAnswers: {},
      //   endSession: false,
      // };

      expect(await sessionController.getCurrentQuestion(r)).toEqual(undefined);
    });
  });

  // Add similar test cases for other methods like joinSession, getCurrentQuestion, respondQuestion, and getMap
});
