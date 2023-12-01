import { Test, TestingModule } from '@nestjs/testing';
import { QuestionnaryService } from './questionnary.service';
import { QuestionnaryDto } from '../dto/questionnary.dto';
import { QuestionnaryCreateDto } from '../dto/questionnaryCreate.dto';
import { QuestionService } from '../../question/service/question.service';
import { Repository } from 'typeorm';
import { Questionnary } from '../entity/questionnary.entity';
import { Question } from '../../question/entity/question.entity';

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
  };
  const mockQuestionnaryRepository = {
    save: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };
  const result: QuestionnaryDto = {
    id: 15,
    title: 'morocco',
    author: 'malias',
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
  };

  const entry: QuestionnaryCreateDto = {
    questions: [
      {
        content: 'Quelle est la capitale du Maroc?',
        answers: [
          {
            content: 'Tunis',
            isCorrect: false,
          },
          {
            content: 'Aggrabah',
            isCorrect: false,
          },
          {
            content: 'Rabat',
            isCorrect: true,
          },
        ],
      },
      {
        content: 'Qui a écrit "Romeo et Juliette"?',
        answers: [
          {
            content: 'William Shakespeare',
            isCorrect: true,
          },
          {
            content: 'Charles Dickens',
            isCorrect: false,
          },
          {
            content: 'Jane Austen',
            isCorrect: false,
          },
          {
            content: 'George Orwell',
            isCorrect: false,
          },
        ],
      },
      {
        content: "Quel est le symbole chimique de l'oxygène?",
        answers: [
          {
            content: 'O',
            isCorrect: true,
          },
          {
            content: 'H',
            isCorrect: false,
          },
          {
            content: 'C',
            isCorrect: false,
          },
          {
            content: 'N',
            isCorrect: false,
          },
          {
            content: 'S',
            isCorrect: false,
          },
        ],
      },
    ],
    title: 'morocco',
    author: 'malias',
  };

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
      let test = await service.createQuestionnary(
        entry.title,
        entry.questions,
        entry.author,
      );

      const resultQuestionnary = { title: 'morocco', author: 'malias' };

      expect(test).not.toEqual(result);
      expect(test).toEqual(resultQuestionnary);
    });
  });

  describe('deleteQuestionnary', () => {
    it('should be returned a boolean', async () => {
      mockQuestionnaryRepository.findOne.mockResolvedValue(result);
      let test = await service.deleteQuestionnary(15);

      expect(test).toEqual(true);
    });
  });

  describe('findQuestionnary', () => {
    it('should be returned a QuestionnaryDTO', async () => {
      mockQuestionnaryRepository.findOne.mockResolvedValue(result);
      mockQuestionService.findQuestion.mockResolvedValue(result.questions);

      let test = await service.findQuestionnary(15);
      expect(test).toEqual(result);
      expect(test).toBeInstanceOf(QuestionnaryDto);
      expect(test).not.toBeFalsy();
      mockQuestionnaryRepository.findOne.mockResolvedValue(null);
      test = await service.findQuestionnary(0);
      expect(typeof test).toBe('string');
      expect(test).not.toBeInstanceOf(QuestionnaryDto);
    });
  });
  describe('addQuestion', () => {
    it('should be returned a boolean', async () => {
      let questionsDTO = {
        content: 'Quelle est la capitale de la France?',
        answers: [
          {
            content: 'Paris',
            isCorrect: true,
          },
          {
            content: 'Londres',
            isCorrect: false,
          },
          {
            content: 'Berlin',
            isCorrect: false,
          },
        ],
      };

      let question = {
        id: 8,
        content: 'Quelle est la capitale de la France?',
        questionnary: {
          id: 1,
          title: 'morocco',
          author: 'malias',
        },
      };

      mockQuestionnaryRepository.findOne.mockResolvedValue(result);
      mockQuestionService.createQuestion.mockResolvedValue(question);
      let test = await service.addQuestion(15, questionsDTO);
      let result3 = {
        id: 15,
        title: 'morocco',
        author: 'malias',
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
      };

      expect(test).toEqual(question);
      expect(test).not.toEqual(questionsDTO);
    });
  });

  describe('deleteQuestions', () => {
    it('should be returned a boolean and delete question', async () => {
      mockQuestionService.deleteQuestion.mockResolvedValue(true);
      mockQuestionnaryRepository.findOne.mockResolvedValue(result);
      let test = await service.deleteQuestion(15, 8);
      expect(test).toBeTruthy();
      mockQuestionService.deleteQuestion.mockResolvedValue(false);
      let test2 = await service.deleteQuestion(15, 8);
      expect(test2).toBeFalsy();
    });
  });

  describe('modifyQuestion', () => {
    it('should be returned a boolean and modify question', async () => {
      mockQuestionService.modifyQuestion.mockResolvedValue(true);
      let questionsDTO = {
        content: 'Quelle est la capitale de la France?',
        answers: [
          {
            content: 'Paris',
            isCorrect: true,
          },
          {
            content: 'Londres',
            isCorrect: false,
          },
          {
            content: 'Berlin',
            isCorrect: false,
          },
        ],
      };
      let test = await service.modifyQuestion(15, 6, questionsDTO);
      expect(test).toBeTruthy();
    });
  });
});
