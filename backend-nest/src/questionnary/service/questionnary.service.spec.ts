import { Test, TestingModule } from '@nestjs/testing';
import { QuestionnaryService } from './questionnary.service';
import { QuestionnaryDto } from '../dto/questionnary.dto';
import { QuestionService } from '../../question/service/question.service';
import { Questionnary } from '../entity/questionnary.entity';
import { Question } from '../../question/entity/question.entity';
import { QuestionnaryController } from '../controller/questionnary.controller';
import { Answer } from '../../question/entity/answer.entity';

describe('QuestionnaryService', () => {
  let service: QuestionnaryService;
  let controller: QuestionnaryController;
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

  const questionnary: Questionnary = {
    id: 15,
    title: 'morocco',
    author: 'malias',
    questions: []
  }
  const questions: Question[] = [
      {
        id: 36,
        content: 'Quelle est la capitale du Maroc?',
        questionnary: questionnary,
        answers: []
      },
      {
        id: 37,
        content: 'Qui a écrit "Romeo et Juliette"?',
        questionnary: questionnary,
        answers: []
      },
      {
        id: 38,
        content: "Quel est le symbole chimique de l'oxygène?",
        questionnary: questionnary,
        answers: []
      }
    ]

  const answers1: Answer[] = [
    {
      id: 104,
      content: 'Tunis',
      isCorrect: false,
      question: questions[0]
    },
    {
      id: 105,
      content: 'Aggrabah',
      isCorrect: false,
      question: questions[0]
    },
    {
      id: 106,
      content: 'Rabat',
      isCorrect: true,
      question: questions[0]
    }
  ]
  const answers2: Answer[] = [
    {
      id: 107,
      content: 'William Shakespeare',
      isCorrect: true,
      question: questions[1]
    },
    {
      id: 108,
      content: 'Charles Dickens',
      isCorrect: false,
      question: questions[1]
    },
    {
      id: 109,
      content: 'Jane Austen',
      isCorrect: false,
      question: questions[1]
    },
    {
      id: 110,
      content: 'George Orwell',
      isCorrect: false,
      question: questions[1]
    },
  ]
  const answers3: Answer[] = [
    {
      id: 111,
      content: 'O',
      isCorrect: true,
      question: questions[2]
    },
    {
      id: 112,
      content: 'H',
      isCorrect: false,
      question: questions[2]
    },
    {
      id: 113,
      content: 'C',
      isCorrect: false,
      question: questions[2]
    },
    {
      id: 114,
      content: 'N',
      isCorrect: false,
      question: questions[2]
    },
    {
      id: 115,
      content: 'S',
      isCorrect: false,
      question: questions[2]
    },
  ]

  questions[0].answers = answers1;
  questions[1].answers = answers2;
  questions[2].answers = answers3;

  questionnary.questions = questions;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuestionnaryService,
        QuestionnaryController,
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
    controller = module.get<QuestionnaryController>(QuestionnaryController);
    questionService = module.get<QuestionService>(QuestionService);
    questionnaryRepository = module.get<'QuestionnaryRepository'>(
      'QuestionnaryRepository',
    );
  });

  describe('createQuestionnary', () => {
    it('should be returned a questionnary', async () => {
      let test = await service.createQuestionnary(
        controller.DtoToQuestionnary(result)
      );

      expect(test).not.toEqual(result);
      expect(test).toEqual(controller.DtoToQuestionnary(result));
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
    it('should be returned a Questionnary', async () => {
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
    it('should be returned a question', async () => {
      mockQuestionnaryRepository.findOne.mockResolvedValue(result);
      mockQuestionService.createQuestion.mockResolvedValue(questions[0]);
      let test = await service.addQuestion(15, controller.DtoToQuestion(result.questions[0], await controller.selectQuestionnary(15)));
      let resultQuestion = questions[0];
      resultQuestion.id = 39;
      expect(test).toEqual(resultQuestion);
      expect(test).not.toEqual(result.questions[0]);
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
      let test = await service.modifyQuestion(questionnary.id, questionnary.questions[0].id, questionnary.questions[0]);
      expect(test).toBeTruthy();
    });
  });
});

