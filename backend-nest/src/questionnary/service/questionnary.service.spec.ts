import { Test, TestingModule } from '@nestjs/testing';
import { QuestionnaryService } from './questionnary.service';
import { QuestionService } from '../../question/service/question.service';
import { Questionnary } from '../entity/questionnary.entity';
import { Question } from '../../question/entity/question.entity';
import { Answer } from '../../question/entity/answer.entity';
import { QuestionType } from '../../question/constants/questionType.constant';

describe('QuestionnaryService', () => {
  let service: QuestionnaryService;
  let questionnaryRepository: 'QuestionnaryRepository';
  let questionService: QuestionService;

  const mockQuestionService = {
    createQuestion: jest.fn(),
    deleteQuestions: jest.fn(),
    deleteQuestion: jest.fn(),
    findQuestion: jest.fn(),
    modifyQuestion: jest.fn(),
    findQuestions: jest.fn(),
    modifyQuestionnary: jest.fn(),
  };

  const mockQuestionnaryRepository = {
    save: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
    find: jest.fn(),
  };

  const questionnary: Questionnary = {
    id: 15,
    title: 'morocco',
    author: 'malias',
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

  let questionnaryTest = new Questionnary();
  questionnaryTest.questions = questions;
  questionnaryTest.id = 15;
  questionnaryTest.author = 'malias';
  questionnaryTest.title = 'morocco';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuestionnaryService,
        {
          provide: QuestionService,
          useValue: mockQuestionService,
        },
        {
          provide: 'QuestionnaryRepository',
          useValue: mockQuestionnaryRepository,
        },
      ],
    }).compile();

    service = module.get<QuestionnaryService>(QuestionnaryService);
    questionService = module.get<QuestionService>(QuestionService);
    questionnaryRepository = module.get<'QuestionnaryRepository'>(
      'QuestionnaryRepository',
    );
  });

  describe('createQuestionnary', () => {
    it('should be returned a questionnary', async () => {
      let test: Questionnary = await service.createQuestionnary(questionnary);

      expect(test).not.toEqual(questionnary);
      expect(test).toBeInstanceOf(Questionnary);
    });
  });

  describe('deleteQuestionnary', () => {
    it('should be returned a boolean', async () => {
      mockQuestionnaryRepository.findOne.mockResolvedValue(questionnary);
      let test = await service.deleteQuestionnary(questionnary.id);
      expect(test).toEqual(true);
    });
  });

  describe('findQuestionnary', () => {
    it('should be returned a Questionnary', async () => {
      mockQuestionnaryRepository.findOne.mockResolvedValue(questionnaryTest);
      mockQuestionService.findQuestion.mockResolvedValue(
        questionnary.questions,
      );

      let test = await service.findQuestionnary(questionnary.id);
      expect(test).toEqual(questionnary);
      expect(test).toBeInstanceOf(Questionnary);
      expect(test).not.toBeFalsy();

      mockQuestionnaryRepository.findOne.mockResolvedValue(null);
      test = await service.findQuestionnary(questionnary.id);
      expect(test).toBeNull();
    });
  });

  describe('findQuestionnariesFromIdUser', () => {
    it('should be returned a set of Questionnaries from a user id', async () => {
      mockQuestionnaryRepository.find.mockResolvedValue([questionnaryTest]);
      mockQuestionService.findQuestion.mockResolvedValue(
        questionnary.questions,
      );

      let test = await service.findQuestionnariesFromIdUser(0); //TODO check for users
      expect(test).toBeInstanceOf(Array);
      expect(test).not.toBeFalsy();
    });
  });

  describe('findQuestionsFromIdQuestionnary', () => {
    it('should be returned an array of Question', async () => {
      mockQuestionnaryRepository.findOne.mockResolvedValue(questionnaryTest);
      mockQuestionService.findQuestions.mockResolvedValue(
        questionnary.questions,
      );

      let test = await service.findQuestionsFromIdQuestionnary(questionnary.id);
      expect(test).toEqual(questionnary.questions);
      expect(test).toBeInstanceOf(Array);
      expect(test).not.toBeFalsy();

      mockQuestionnaryRepository.findOne.mockResolvedValue(null);
      mockQuestionService.findQuestions.mockResolvedValue(null);
      test = await service.findQuestionsFromIdQuestionnary(0);
      expect(test).toBeNull();
    });
  });

  describe('addQuestion', () => {
    it('should be returned a question', async () => {
      mockQuestionnaryRepository.findOne.mockResolvedValue(questionnary);
      mockQuestionService.createQuestion.mockResolvedValue(questions[0]);
      let test = await service.addQuestion(questionnary.id, questions[0]);
      let resultQuestion = questions[0];
      resultQuestion.id = 39;
      expect(test).toEqual(resultQuestion);
      expect(test).toEqual(questionnary.questions[0]);
    });
  });

  describe('deleteQuestions', () => {
    it('should be returned a boolean and delete question', async () => {
      mockQuestionService.deleteQuestion.mockResolvedValue(true);
      mockQuestionnaryRepository.findOne.mockResolvedValue(questionnary);
      let test = await service.deleteQuestion(
        questionnary.id,
        questionnary.questions[0].id,
      );
      expect(test).toBeTruthy();
      mockQuestionService.deleteQuestion.mockResolvedValue(false);
      let test2 = await service.deleteQuestion(
        questionnary.id,
        questionnary.questions[0].id,
      );
      expect(test2).toBeFalsy();
    });
  });

  describe('modifyQuestion', () => {
    it('should be returned a boolean and modify question', async () => {
      mockQuestionService.modifyQuestion.mockResolvedValue(true);
      let test = await service.modifyQuestion(
        questionnary.id,
        questionnary.questions[0].id,
        questionnary.questions[0],
      );
      expect(test).toBeTruthy();
    });
  });

  describe('modifyQuestionnary', () => {
    it('should be returned a boolean and modify question', async () => {
      mockQuestionnaryRepository.findOne.mockResolvedValue(questionnaryTest);
      mockQuestionService.modifyQuestionnary.mockResolvedValue(true);
      let test = await service.modifyQuestionnary(
        questionnary.id,
        'nouveau titre',
        'nouvel auteur',
      );
      expect(test).toBeTruthy();
    });
  });
});
