import { Test, TestingModule } from '@nestjs/testing';
import { QuestionService } from './question.service';
import { Question } from '../entity/question.entity';
import { Questionnary } from '../../questionnary/entity/questionnary.entity';

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

  const questionnary: Questionnary = {
    id: 1,
    title: 'testQuestionnary',
    author: 'authorTest',
    questions: [],
  };


  describe('createQuestion', () => {
    it('should be created a question and returned it', async () => {
      mockQuestionRepository.find;
      let test = await service.createQuestion(QuestionMock, QuestionMock.questionnary);
      expect(test).toBeInstanceOf(Question);
    });
  });

  describe('findQuestion', () => {
    it('should search a question with id and returned it', async () => {

      questionnary.questions[0] = QuestionMock;
      let qTab: Question[] = [];
      qTab[0] = QuestionMock;
      mockQuestionRepository.find.mockResolvedValue(qTab);
      let test : Question[] = await service.findQuestion(questionnary);
      expect(test).not.toBeNull();
      expect(test).toBeInstanceOf(Array);
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
      let test = service.modifyQuestion(QuestionMock,QuestionMock.questionnary,1);
      expect(test).toBeTruthy();
      expect(test).not.toEqual(QuestionMock);

    });
  });
});
