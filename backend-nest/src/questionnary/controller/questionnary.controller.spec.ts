import { Test, TestingModule } from '@nestjs/testing';
import { QuestionnaryController } from './questionnary.controller';
import { QuestionnaryDto } from '../dto/questionnary.dto';
import { QuestionnaryService } from '../service/questionnary.service';
import { QuestionnaryCreateDto } from '../dto/questionnaryCreate.dto';

describe('QuestionnaryController', () => {
  let controller: QuestionnaryController;
  let service: QuestionnaryService;

  const mockQuestionnaryService = {
    createQuestionnary: jest.fn(),
    findQuestionnary: jest.fn(),
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
      controllers: [QuestionnaryController],
      providers: [QuestionnaryService],
    })
      .overrideProvider(QuestionnaryService)
      .useValue(mockQuestionnaryService)
      .compile();

    controller = await module.resolve(QuestionnaryController);
    service = await module.resolve(QuestionnaryService);
  });

  describe('createQuestionnary', () => {
    it('should be returned a questionnaryDTO', async () => {
      mockQuestionnaryService.createQuestionnary.mockResolvedValue(result);
      const test = await controller.createQuestionnary(entry);
      expect(test).toEqual(result);
    });
  });

  describe('selectQuestionnary', () => {
    it('should be returned a questionnaryDTO', async () => {
      const idQuestionnary: number = 15;
      mockQuestionnaryService.findQuestionnary.mockResolvedValue(result);
      const test = await controller.selectQuestionnary(idQuestionnary);
      expect(test).toEqual(result);
    });
  });
});
