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
    get: jest.fn(),
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

  describe('Create Session', () => {
    it('createSession : Should be return a session', async () => {
      let question: Question[] = null;

      /*{
        questions: [
          {
            id: 36,
            content: 'Quelle est la capitale du Maroc?',
            answers: [
              {
                id: 104,
                content: 'Tunis',
                isCorrect: false,
              },
              {
                id: 105,
                content: 'Aggrabah',
                isCorrect: false,
              },
              {
                id: 106,
                content: 'Rabat',
                isCorrect: true,
              },
            ],
          },
          {
            id: 37,
            content: 'Qui a écrit "Romeo et Juliette"?',
            answers: [
              {
                id: 107,
                content: 'William Shakespeare',
                isCorrect: true,
              },
              {
                id: 108,
                content: 'Charles Dickens',
                isCorrect: false,
              },
              {
                id: 109,
                content: 'Jane Austen',
                isCorrect: false,
              },
              {
                id: 110,
                content: 'George Orwell',
                isCorrect: false,
              },
            ],
          },
          {
            id: 38,
            content: "Quel est le symbole chimique de l'oxygène?",
            answers: [
              {
                id: 111,
                content: 'O',
                isCorrect: true,
              },
              {
                id: 112,
                content: 'H',
                isCorrect: false,
              },
              {
                id: 113,
                content: 'C',
                isCorrect: false,
              },
              {
                id: 114,
                content: 'N',
                isCorrect: false,
              },
              {
                id: 115,
                content: 'S',
                isCorrect: false,
              },
            ],
          },
        ],
      };*/

      mockQuestionService.findAllWithQuestion.mockResolvedValue(null);
      const sessionconst = await service.createSession('111111');
      expect(sessionconst instanceof Session).toBe(true);
      expect(typeof sessionconst.id).toBe('string');
      expect(sessionconst.id).toEqual('111111');
    });
  });

  /*describe('nextQuestion', () => {
    it('nextQuestion : should be returned a question', async () => {
      let session: Session = {
        id: '111111',

        questionList: null,

        //[{     id: 1,     content: "string",     answers: [{       id: 1,       content: "string",       isCorrect: true,     }],   }],

        questionNumber: -1,

        connectedUser: null,

        userAnswers: null,

        endSession: false,
      };
      mockQuestionService.findAllWithQuestion.mockResolvedValue(null);
      mockMap.get.mockResolvedValue(session);
      const sessionconst = await service.createSession('111111');
      sessionconst.questionNumber = -1;
      //sessionconst.questionList.length = 1;
      let test = await service.nextQuestion('111111');
      //expect(typeof test).toBe('string');
      expect(test instanceof Question).toBe(true);
    });
  });*/
});
