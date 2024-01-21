import { QuestionnaryController } from './questionnary.controller';
import { QuestionnaryService } from '../service/questionnary.service';
import { TestBed } from '@automock/jest';
import { QuestionnaryMapper } from '../mapper/questionnary.mapper';

describe('QuestionnaryController', () => {
  let controller: QuestionnaryController;
  let questionnaryService: jest.Mocked<QuestionnaryService>;
  let questionnaryMapper: jest.Mocked<QuestionnaryMapper>;

  beforeAll(() => {
    const { unit, unitRef } = TestBed.create(QuestionnaryController).compile();
    controller = unit;
    questionnaryService = unitRef.get(QuestionnaryService);
    questionnaryMapper = unitRef.get(QuestionnaryMapper);
  });
  /*
  const result: QuestionnaryDto = {
    "id": 15,
    "title": "morocco",
    "author": "malias",
    "questions": [
      {
        "id": 36,
        "content": "Quelle est la capitale du Maroc?",
        "answers": [
          {
            "id": 104,
            "content": "Tunis",
            "isCorrect": false
          },
          {
            "id": 105,
            "content": "Aggrabah",
            "isCorrect": false
          },
          {
            "id": 106,
            "content": "Rabat",
            "isCorrect": true
          }
        ]
      },
      {
        "id": 37,
        "content": "Qui a écrit \"Romeo et Juliette\"?",
        "answers": [
          {
            "id": 107,
            "content": "William Shakespeare",
            "isCorrect": true
          },
          {
            "id": 108,
            "content": "Charles Dickens",
            "isCorrect": false
          },
          {
            "id": 109,
            "content": "Jane Austen",
            "isCorrect": false
          },
          {
            "id": 110,
            "content": "George Orwell",
            "isCorrect": false
          }
        ]
      },
      {
        "id": 38,
        "content": "Quel est le symbole chimique de l'oxygène?",
        "answers": [
          {
            "id": 111,
            "content": "O",
            "isCorrect": true
          },
          {
            "id": 112,
            "content": "H",
            "isCorrect": false
          },
          {
            "id": 113,
            "content": "C",
            "isCorrect": false
          },
          {
            "id": 114,
            "content": "N",
            "isCorrect": false
          },
          {
            "id": 115,
            "content": "S",
            "isCorrect": false
          }
        ]
      }
    ]
  };

  const entry : QuestionnaryCreateDto = {
    "questions": [
      {
        "content": "Quelle est la capitale du Maroc?",
        "answers": [
          {
            "content": "Tunis",
            "isCorrect": false
          },
          {
            "content": "Aggrabah",
            "isCorrect": false
          },
          {
            "content": "Rabat",
            "isCorrect": true
          }
        ]
      },
      {
        "content": "Qui a écrit \"Romeo et Juliette\"?",
        "answers": [
          {
            "content": "William Shakespeare",
            "isCorrect": true
          },
          {
            "content": "Charles Dickens",
            "isCorrect": false
          },
          {
            "content": "Jane Austen",
            "isCorrect": false
          },
          {
            "content": "George Orwell",
            "isCorrect": false
          }
        ]
      },
      {
        "content": "Quel est le symbole chimique de l'oxygène?",
        "answers": [
          {
            "content": "O",
            "isCorrect": true
          },
          {
            "content": "H",
            "isCorrect": false
          },
          {
            "content": "C",
            "isCorrect": false
          },
          {
            "content": "N",
            "isCorrect": false
          },
          {
            "content": "S",
            "isCorrect": false
          }
        ]
      }

    ],
    "title": "morocco",
    "author": "malias"
  };
*/

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(questionnaryService).toBeDefined();
    expect(questionnaryMapper).toBeDefined();
  });
  /*
  describe('createQuestionnary', () => {
    it('should be returned a questionnary', async () => {

      mockQuestionnaryService.createQuestionnary.mockResolvedValue(controller.DtoToQuestionnary(result));
      const test = await controller.createQuestionnary(entry);
      expect(test).toEqual(controller.DtoToQuestionnary(result));

    });
  });

  describe('selectQuestionnary', () => {
    it('should be returned a questionnary', async () => {
      const idQuestionnary : number = 15;
      mockQuestionnaryService.findQuestionnary.mockResolvedValue(controller.DtoToQuestionnary(result));
      const test = await controller.selectQuestionnary(idQuestionnary);
      expect(test).toEqual(controller.DtoToQuestionnary(result));

    });
  });*/
});
