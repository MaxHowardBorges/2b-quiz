import { Test, TestingModule } from '@nestjs/testing';
import { QuestionService } from './question.service';
import { Question } from '../entity/question.entity';
import { Questionnary } from '../../questionnary/entity/questionnary.entity';
import { Answer } from '../entity/answer.entity';
import { QuestionType } from '../constants/questionType.constant';
import { generateTeacherMock } from '../../../test/mock/user.mock';

describe('QuestionService', () => {
  let service: QuestionService;
  let questionRepository: 'QuestionRepository';
  let answerRepository: 'AnswerRepository';

  const mockQuestionRepository = {
    save: jest.fn(),
    find: jest.fn(),
    delete: jest.fn(),
    findOne: jest.fn(),
  };

  const mockAnswerRepository = {
    save: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuestionService,
        {
          provide: 'QuestionRepository',
          useValue: mockQuestionRepository,
        },
        {
          provide: 'AnswerRepository',
          useValue: mockAnswerRepository,
        },
      ],
    }).compile();

    service = module.get<QuestionService>(QuestionService);
    questionRepository = module.get<'QuestionRepository'>('QuestionRepository');
    answerRepository = module.get<'AnswerRepository'>('AnswerRepository');
  });

  const questionnary: Questionnary = {
    id: 15,
    title: 'morocco',
    author: generateTeacherMock(),
    questions: [],
  };
  const questions: Question[] = [
    {
      id: 36,
      content: 'Quelle est la capitale du Maroc?',
      questionnary: questionnary,
      type: QuestionType.QCU,
      answers: [],
    },
    {
      id: 37,
      content: 'Qui a écrit "Romeo et Juliette"?',
      questionnary: questionnary,
      type: QuestionType.QCU,
      answers: [],
    },
    {
      id: 38,
      content: "Quel est le symbole chimique de l'oxygène?",
      questionnary: questionnary,
      type: QuestionType.QCU,
      answers: [],
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

  let questionTest = new Question();
  questionTest.answers = answers1;
  questionTest.id = 38;
  questionTest.questionnary = questionnary;
  questionTest.content = 'Quelle est la capitale du Maroc?';
  questionTest.type = QuestionType.QCU;

  describe('createQuestion', () => {
    it('should create a question and return it', async () => {
      let test = await service.createQuestion(
        questions[0],
        questions[0].questionnary,
      );
      expect(test).toBeInstanceOf(Question);
    });
  });

  describe('deleteQuestions', () => {
    it('should delete question and return a bool', async () => {
      expect(questionnary.questions[2]).toEqual(questions[2]);
      let test = service.deleteQuestions(questionnary);
      expect(test).toBeTruthy();
    });
  });

  describe('findQuestion', () => {
    it('should search a question with id and return it', async () => {
      mockQuestionRepository.findOne.mockResolvedValue(questionTest);
      let test: Question = await service.findQuestion(questions[0].id);
      expect(test).not.toBeNull();
      expect(test).toBeInstanceOf(Question);
    });
  });

  describe('findQuestions', () => {
    it('should get all questions from a questionnary', async () => {
      mockQuestionRepository.find.mockResolvedValue(questions);
      let test: Question[] = await service.findQuestions(questionnary);
      expect(test).not.toBeNull();
      expect(test).toBeInstanceOf(Array);
    });
  });

  describe('findAnswers', () => {
    it('should get all answers from a question', async () => {
      mockQuestionRepository.findOne.mockResolvedValue(questionTest);
      let test: Answer[] = await service.findAnswers(
        questionnary.questions[0].id,
      );
      //console.log(test);
      expect(test).not.toBeNull();
      expect(test).toBeInstanceOf(Array);
    });
  });

  describe('deleteQuestion', () => {
    it('should delete question and return a bool', async () => {
      expect(questionnary.questions[2]).toEqual(questions[2]);
      let test = service.deleteQuestion(
        questionnary,
        questionnary.questions[2].id,
      );
      expect(test).toBeTruthy();
    });
  });

  describe('modifyQuestion', () => {
    it('should modify a question and return a boolean', async () => {
      mockQuestionRepository.findOne.mockResolvedValue(questions[0]);
      const modifiedQuestion: Question = {
        id: null,
        content: "Quelle est la capitale de l'Egypte?",
        questionnary: questionnary,
        type: QuestionType.QCU,
        answers: [],
      };
      modifiedQuestion.answers = [
        {
          id: null,
          content: 'Alexandrie',
          isCorrect: false,
          question: modifiedQuestion,
        },
        {
          id: null,
          content: 'Jerusalem',
          isCorrect: false,
          question: modifiedQuestion,
        },
        {
          id: null,
          content: 'Le Caire',
          isCorrect: true,
          question: modifiedQuestion,
        },
      ];
      let test = service.modifyQuestion(
        modifiedQuestion,
        questions[0].questionnary,
        questions[0].id,
      );
      expect(test).toBeTruthy();
      expect(test).not.toEqual(questions[0]);
    });
  });
});
