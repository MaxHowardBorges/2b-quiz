import { QuestionnaryService } from './questionnary.service';
import { QuestionService } from '../../question/service/question.service';
import { Questionnary } from '../entity/questionnary.entity';
import { Question } from '../../question/entity/question.entity';
import { Answer } from '../../question/entity/answer.entity';
import { QuestionType } from '../../question/constants/questionType.constant';
import { TestBed } from '@automock/jest';
import { generateTeacherMock } from '../../../test/mock/user.mock';
import { Repository } from 'typeorm';
import { Teacher } from '../../user/entity/teacher.entity';
import { QuestionCreateDto } from '../../question/dto/questionCreate.dto';

describe('QuestionnaryService', () => {
  let service: QuestionnaryService;
  let questionnaryRepository: jest.Mocked<Repository<Questionnary>>;
  let questionService: jest.Mocked<QuestionService>;
  let mockTeacher: Teacher;
  mockTeacher = generateTeacherMock();

  // TODO deplace questionnary/question generation in /test/mock
  const questionnary: Questionnary = {
    isCompilated: false,
    id: 15,
    title: 'morocco',
    author: mockTeacher,
    questions: [],
  };
  const questions: Question[] = [
    {
      id: 36,
      content: 'Quelle est la capitale du Maroc?',
      questionnary: questionnary,
      type: QuestionType.QCU,
      answers: [],
      tags: [],
      author: mockTeacher,
      originalId: null,
      equals(question: Question): boolean {
        return this.id === question.id;
      },
    },
    {
      id: 37,
      content: 'Qui a écrit "Romeo et Juliette"?',
      questionnary: questionnary,
      type: QuestionType.QCU,
      answers: [],
      tags: [],
      author: mockTeacher,
      originalId: null,
      equals(question: Question): boolean {
        return this.id === question.id;
      },
    },
    {
      id: 38,
      content: "Quel est le symbole chimique de l'oxygène?",
      questionnary: questionnary,
      type: QuestionType.QCU,
      answers: [],
      tags: [],
      author: mockTeacher,
      originalId: null,
      equals(question: Question): boolean {
        return this.id === question.id;
      },
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

  const questionnaryTest = new Questionnary();
  questionnaryTest.questions = questions;
  questionnaryTest.id = 15;
  questionnaryTest.author = generateTeacherMock();
  questionnaryTest.title = 'morocco';

  beforeAll(() => {
    const { unit, unitRef } = TestBed.create(QuestionnaryService).compile();

    service = unit;
    questionService = unitRef.get(QuestionService);
    questionnaryRepository = unitRef.get('QuestionnaryRepository');
  });

  // beforeEach(async () => {
  //   const module: TestingModule = await Test.createTestingModule({
  //     providers: [
  //       QuestionnaryService,
  //       {
  //         provide: QuestionService,
  //         useValue: mockQuestionService,
  //       },
  //       {
  //         provide: 'QuestionnaryRepository',
  //         useValue: mockQuestionnaryRepository,
  //       },
  //     ],
  //   }).compile();
  //
  //   service = module.get<QuestionnaryService>(QuestionnaryService);
  //   questionService = module.get<QuestionService>(QuestionService);
  //   questionnaryRepository = module.get<'QuestionnaryRepository'>(
  //     'QuestionnaryRepository',
  //   );
  // });

  describe('createQuestionnary', () => {
    it('should be returned a questionnary', async () => {
      const test: Questionnary = await service.createQuestionnary(
        questionnary,
        generateTeacherMock(),
      );

      expect(test).not.toEqual(questionnary);
      expect(test).toBeInstanceOf(Questionnary);
    });
  });

  describe('deleteQuestionnary', () => {
    it('should be returned a boolean', async () => {
      questionnaryRepository.findOne.mockResolvedValue(questionnary);
      const test = await service.deleteQuestionnary(questionnary.id);
      expect(test).toEqual(true);
    });
  });

  describe('findQuestionnary', () => {
    it('should be returned a Questionnary', async () => {
      questionnaryRepository.findOne.mockResolvedValue(questionnaryTest);

      let test = await service.findQuestionnary(questionnaryTest.id);
      expect(test).toEqual(questionnaryTest);
      expect(test).toBeInstanceOf(Questionnary);
      expect(test).not.toBeFalsy();

      questionService.findQuestions.mockResolvedValue(questionnary.questions);
      questionnaryRepository.findOne.mockResolvedValue(null);
      test = await service.findQuestionnary(questionnary.id);
      expect(test).toBeNull();
    });
  });

  describe('findQuestionnariesFromIdUser', () => {
    it('should be returned a set of Questionnaries from a user id', async () => {
      questionnaryRepository.find.mockResolvedValue([questionnaryTest]);
      questionService.findQuestions.mockResolvedValue(questionnary.questions);

      const test = await service.findQuestionnariesFromIdUser(
        generateTeacherMock(),
      );
      expect(test).toBeInstanceOf(Array);
      expect(test).not.toBeFalsy();
    });
  });

  describe('findQuestionsFromIdQuestionnary', () => {
    it('should be returned an array of Question', async () => {
      questionnaryRepository.findOne.mockResolvedValue(questionnaryTest);
      questionService.findQuestions.mockResolvedValue(questionnary.questions);

      let test = await service.findQuestionsFromIdQuestionnary(questionnary.id);
      expect(test).toEqual(questionnary.questions);
      expect(test).toBeInstanceOf(Array);
      expect(test).not.toBeFalsy();

      questionnaryRepository.findOne.mockResolvedValue(null);
      questionService.findQuestions.mockResolvedValue(null);
      test = await service.findQuestionsFromIdQuestionnary(0);
      expect(test).toBeNull();
    });
  });

  describe('addQuestion', () => {
    it('should be returned a question', async () => {
      questionnaryRepository.findOne.mockResolvedValue(questionnary);
      questionService.createQuestion.mockResolvedValue(questions[0]);
      questionService.findQuestion.mockResolvedValue(questions[0]);
      questionService.dtoToQuestion.mockReturnValue(questions[0]);
      const teacher = generateTeacherMock();
      const test = await service.addQuestion(
        teacher,
        questionnary.id,
        questions[0],
      );
      const resultQuestion = questions[0];
      resultQuestion.id = 39;
      expect(test).toEqual(resultQuestion);
      expect(test).toEqual(questionnary.questions[0]);
    });
  });

  describe('deleteQuestions', () => {
    it('should be returned a boolean and delete question', async () => {
      questionService.deleteQuestion.mockResolvedValue(true);
      questionnaryRepository.findOne.mockResolvedValue(questionnary);
      questionService.dtoToQuestion.mockReturnValue(questions[0]);
      const test = await service.deleteQuestion(
        questionnary.id,
        questionnary.questions[0].id,
      );
      expect(test).toBeTruthy();
      questionService.deleteQuestion.mockResolvedValue(false);
      const test2 = await service.deleteQuestion(
        questionnary.id,
        questionnary.questions[0].id,
      );
      expect(test2).toBeFalsy();
    });
  });

  describe('modifyQuestion', () => {
    it('should be returned a boolean and modify question', async () => {
      questionnaryRepository.findOne.mockResolvedValue(questionnaryTest);
      questionService.modifyQuestion.mockResolvedValue(true);
      questionService.dtoToQuestion.mockReturnValue(questions[0]);
      const test = await service.modifyQuestion(
        questionnary.id,
        questionnary.questions[0].id,
        new QuestionCreateDto(),
      );
      expect(test).toBeTruthy();
    });
  });

  describe('modifyQuestionnary', () => {
    it('should be returned a boolean and modify question', async () => {
      questionnaryRepository.findOne.mockResolvedValue(questionnaryTest);
      questionService.modifyQuestion.mockResolvedValue(true);
      const test = await service.modifyQuestionnary(
        questionnary.id,
        'nouveau titre',
        generateTeacherMock(),
      );
      expect(test).toBeTruthy();
    });
  });
});
