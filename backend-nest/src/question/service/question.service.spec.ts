import { Test, TestingModule } from '@nestjs/testing';
import { QuestionService } from './question.service';
import { Question } from '../entity/question.entity';
import { QuestionCreateDto } from '../dto/questionCreate.dto';
import { Questionnary } from '../../questionnary/entity/questionnary.entity';
import { QuestionnaryDto } from '../../questionnary/dto/questionnary.dto';

describe('QuestionService', () => {
  let service: QuestionService;
  let questionRepository: 'QuestionRepository';
  let answerRepository: 'AnswerRepository';
  //let questionnaryService

  const mockQuestionRepository = {
    save: jest.fn(),
    find: jest.fn(),
  };

  const mockAnswerRepository = {
    save: jest.fn(),
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

  const questionsDTO: QuestionCreateDto = {
    content: 'aa',
    answers: [
      {
        content: '455',
        isCorrect: false,
      },
    ],
  };

  const questionnary: Questionnary = {
    id: 1,
    title: 'testQuestionnary',
    author: 'authorTest',
    questions: null,
  };

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
      let test = await service.createQuestion(questionsDTO, questionnary);
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
      //mockQuestionRepository.find.mockResolvedValue(questionnaryDTO.questions{where: { questionnary, id: 1 }})
      let test = await service.findQuestion(questionnary);
      expect(test).toBeInstanceOf(Question);
    });
  });
});
