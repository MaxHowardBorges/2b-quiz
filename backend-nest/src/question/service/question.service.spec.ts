import { Test, TestingModule } from '@nestjs/testing';
import { QuestionService } from './question.service';
import { Question } from '../entity/question.entity';
import { QuestionCreateDto } from '../dto/questionCreate.dto';
import { Questionnary } from '../../questionnary/entity/questionnary.entity';
import { QuestionnaryDto } from '../../questionnary/dto/questionnary.dto';
import { QuestionDto } from '../dto/question.dto';

describe('QuestionService', () => {
  let service: QuestionService;

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
  });

  const questionsCreateDTO: QuestionCreateDto = {
    content: 'aa',
    answers: [],
  };

  const answerCreateDTO = {
    content: '455',
    isCorrect: false,
  };

  questionsCreateDTO.answers[0] = answerCreateDTO;

  const questionsDTO: QuestionDto = {
    id: 1,
    content: 'Exemple de contenu',
    answers: [
      {
        id: 1,
        content: 'Exemple de réponse',
        isCorrect: false,
      },
    ],
  };

  const QuestionMock: Question = {
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
  };

  const questionnary = new Questionnary();

  questionnary.id = 1;
  questionnary.title = 'testQuestionnary';
  questionnary.author = 'authorTest';
  questionnary.questions = [];

  const questionnaryDTO: QuestionnaryDto = {
    id: 1,
    title: 'testQuestionnary',
    author: 'authorTest',
    questions: [
      {
        id: 12,
        content: 'Quelle est la capitale du Maroc?',
        answers: [
          {
            id: 43,
            content: '455',
            isCorrect: false,
          },
        ],
      },
    ],
  };

  describe('createQuestion', () => {
    it('should be created a question and returned it', async () => {
      mockQuestionRepository.find;
      let test = await service.createQuestion(questionsCreateDTO, questionnary);
      expect(test).toBeInstanceOf(Question);
    });
  });

  describe('findQuestion', () => {
    it('should search a question with id and returned it', async () => {
      const expectedQuestion = {
        id: 1,
        content: 'returned question',
        answers: [],
      };

      questionnary.questions[0] = QuestionMock;
      let qTab: Question[] = [];
      qTab[0] = QuestionMock;
      mockQuestionRepository.find.mockResolvedValue(qTab);
      let test: QuestionDto[] = await service.findQuestion(questionnary);
      expect(test).not.toBeNull();
      expect(test).toBeInstanceOf(Array);
      let tabTest: QuestionDto[] = [];
      tabTest[0] = questionsDTO;
      expect(test).toEqual(tabTest);
      expect(test).not.toEqual(questionsDTO);
    });
  });

  describe('deleteQuestion', () => {
    it('should delete question and return a bool', async () => {
      let qTest = questionnary;
      qTest.questions[0] = QuestionMock;
      expect(qTest.questions[0]).toEqual(QuestionMock);
      let test = service.deleteQuestion(qTest, 1);
      expect(test).toBeTruthy();
    });
  });

  describe('modifyQuestion', () => {
    it('should modify a question and return a boolean', async () => {
      mockQuestionRepository.findOne.mockResolvedValue(QuestionMock);
      let test = service.modifyQuestion(questionsCreateDTO, questionnary, 1);
      expect(test).toBeTruthy();
      expect(test).not.toEqual(QuestionMock);
    });
  });
});
