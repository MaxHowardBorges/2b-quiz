import { Test, TestingModule } from '@nestjs/testing';
import { QuestionnaryService } from './questionnary.service';
import { QuestionnaryDto } from '../dto/questionnary.dto';
import { QuestionnaryCreateDto } from '../dto/questionnaryCreate.dto';
import { QuestionService } from '../../question/service/question.service';
import { Repository } from 'typeorm';
import { Questionnary } from '../entity/questionnary.entity';

describe('QuestionnaryService', () => {
  let service: QuestionnaryService;
  let questionnaryRepository: 'QuestionnaryRepository';
  let questionService: QuestionService;

  const mockQuestionService = {
    createQuestion: jest.fn(),
  };
  const mockQuestionnaryRepository = {
    save: jest.fn(),
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

  /*beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuestionnaryService],
    }).compile();*/

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
      //mockQuestionnaryService.createQuestionnary.mockResolvedValue(result);
      for (const q of entry.questions) {
        mockQuestionService.createQuestion.mockResolvedValue(q);
        //await this.questionService.createQuestion(q, questionnary);
      }
      const test = await service.createQuestionnary(
        entry.title,
        entry.questions,
        entry.author,
      );

      const result2 = { title: 'morocco', author: 'malias' };

      expect(test).not.toEqual(result);
      expect(test).toEqual(result2);
    });
  });
});
