import { Test, TestingModule } from '@nestjs/testing';
import { SessionService } from './session.service';
import { QuestionService } from '../../question/service/question.service';
import { AnswerMapper } from '../../question/mapper/answer.mapper';
import { EventService } from '../../event/service/event.service';
import { Session } from '../session';
import { Question } from '../../question/entity/question.entity';
import { Questionnary } from '../../questionnary/entity/questionnary.entity';
import { QuestionType } from '../../question/constants/questionType.constant';
import { Answer } from '../../question/entity/answer.entity';
import { QuestionnaryService } from '../../questionnary/service/questionnary.service';
import { generateTeacherMock } from '../../../test/mock/user.mock';
import { ParticipantInterface } from '../../user/interface/participant.interface';

describe('SessionService', () => {
  let service: SessionService;
  let questionService: QuestionService;
  let questionnaryService: QuestionnaryService;
  let answerMapper: AnswerMapper;
  let eventService: EventService;
  let sessionMap: Map<string, Session>;

  const mockQuestionService = {
    createQuestion: jest.fn(),
    deleteQuestions: jest.fn(),
    deleteQuestion: jest.fn(),
    findQuestion: jest.fn(),
    findQuestions: jest.fn(),
    modifyQuestion: jest.fn(),
    findAllWithQuestion: jest.fn(),
  };

  const mockQuestionnaryService = {
    findQuestionnary: jest.fn(),
    findQuestionsFromIdQuestionnary: jest.fn(),
  };

  const mockQuestionnaryRepository = {
    findOne: jest.fn(),
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

  const hostTeacher = generateTeacherMock();

  const questionnary: Questionnary = {
    id: 15,
    title: 'morocco',
    author: hostTeacher,
    questions: [],
  };
  const questions: Question[] = [
    {
      id: 36,
      content: 'Quelle est la capitale du Maroc?',
      questionnary: questionnary,
      type: QuestionType.QCU,
      answers: [],
      tags: [],
      author: null,
    },
    {
      id: 37,
      content: 'Qui a écrit "Romeo et Juliette"?',
      questionnary: questionnary,
      type: QuestionType.QCU,
      answers: [],
      tags: [],
      author: null,
    },
    {
      id: 38,
      content: "Quel est le symbole chimique de l'oxygène?",
      questionnary: questionnary,
      type: QuestionType.QCU,
      answers: [],
      tags: [],
      author: null,
    },
  ];

  const answers1: Answer[] = [
    {
      id: 104,
      content: 'Tunis',
      isCorrect: false,
      question: questions[0],
    },
    {
      id: 105,
      content: 'Aggrabah',
      isCorrect: false,
      question: questions[0],
    },
    {
      id: 106,
      content: 'Rabat',
      isCorrect: true,
      question: questions[0],
    },
  ];
  const answers2: Answer[] = [
    {
      id: 107,
      content: 'William Shakespeare',
      isCorrect: true,
      question: questions[1],
    },
    {
      id: 108,
      content: 'Charles Dickens',
      isCorrect: false,
      question: questions[1],
    },
    {
      id: 109,
      content: 'Jane Austen',
      isCorrect: false,
      question: questions[1],
    },
    {
      id: 110,
      content: 'George Orwell',
      isCorrect: false,
      question: questions[1],
    },
  ];
  const answers3: Answer[] = [
    {
      id: 111,
      content: 'O',
      isCorrect: true,
      question: questions[2],
    },
    {
      id: 112,
      content: 'H',
      isCorrect: false,
      question: questions[2],
    },
    {
      id: 113,
      content: 'C',
      isCorrect: false,
      question: questions[2],
    },
    {
      id: 114,
      content: 'N',
      isCorrect: false,
      question: questions[2],
    },
    {
      id: 115,
      content: 'S',
      isCorrect: false,
      question: questions[2],
    },
  ];

  questions[0].answers = answers1;
  questions[1].answers = answers2;
  questions[2].answers = answers3;

  questionnary.questions = questions;

  const questionnaryTest = new Questionnary();
  questionnaryTest.questions = questions;
  questionnaryTest.id = 15;
  questionnaryTest.author = hostTeacher;
  questionnaryTest.title = 'morocco';

  const session: Session = {
    hasUser(user: ParticipantInterface): boolean {
      return false;
    },
    id: '111111',
    questionnaryList: [],
    questionnaryNumber: 0,
    questionNumber: 0,
    connectedUser: null,
    userAnswers: null,
    endSession: false,
    host: hostTeacher,
  };
  session.questionnaryList.push(questionnary);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionService,
        {
          provide: QuestionService,
          useValue: mockQuestionService,
        },
        {
          provide: QuestionnaryService,
          useValue: mockQuestionnaryService,
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
    questionnaryService = module.get<QuestionnaryService>(QuestionnaryService);
    eventService = module.get<EventService>(EventService);
    sessionMap = module.get<Map<string, Session>>(Map<string, Session>);
  });

  describe('initializeSession', () => {
    it('generate idSession : should be returned an idSession, should be a STRING', async () => {
      const test = service.generateIdSession();
      expect(typeof test).toBe('string');
      expect(test.length).toEqual(6);
      expect(typeof test).not.toBe('Integer');
    });
    it('initializeSession : should be not equal to the empty session', async () => {
      const testSession = await service.initializeSession(hostTeacher, [
        questionnary.id,
      ]);
      expect(testSession).not.toEqual(session);
      expect(testSession).toBeInstanceOf(Session);
      expect(testSession.id).not.toBeNull();
      expect(testSession.id).not.toMatch(/[a-zA-ZÀ-ÿ]/);
    });
  });

  describe('CreateSession', () => {
    it('should create a session and return a Session', async () => {
      const test = await service.createSession(
        service.generateIdSession(),
        hostTeacher,
        [questionnary],
      );
      expect(test).toBeInstanceOf(Session);
      expect(typeof test.id).toBe('string');
    });
  });

  describe('nextQuestion', () => {
    it('should return the next question', async () => {
      mockMap.get.mockReturnValue(session);
      mockQuestionnaryService.findQuestionsFromIdQuestionnary.mockResolvedValue(
        questions,
      );
      mockQuestionService.findQuestion.mockResolvedValue(questions[0]);
      const mockSessionMap = new Map<string, Session>();
      mockSessionMap.set('111111', session);
      (service as any).sessionMap = mockSessionMap;

      const test = await service.nextQuestion('111111');
      expect(test).not.toBeNull();
      expect(test).not.toEqual(session);
      const session2: Session = session;
      const quest = new Question();
      quest.answers = [];

      session2.questionNumber = 0;
      mockSessionMap.set('111111', session2);
      (service as any).sessionMap = mockSessionMap;
      const test2 = await service.nextQuestion('111111');
      expect(test2).not.toEqual(quest);
    });
  });

  //TODO NOT WORKING
  /*describe('currentQuestion', () => {
    it('should return the current question', async () => {
      const mockSessionMap = new Map<string, Session>();
      mockSessionMap.set('111111', session);
      (service as any).sessionMap = mockSessionMap;
      mockAnswerMapper.mapAnswersStudentDtos.mockReturnValue(undefined);
      mockQuestionService.findQuestion(questions[1].id);
      let test = service.currentQuestion('111111');
      expect(test).toBeTruthy();

      mockAnswerMapper.mapAnswersStudentDtos.mockResolvedValue(
        new AnswerMapper(),
      );
    });
  });*/
});
