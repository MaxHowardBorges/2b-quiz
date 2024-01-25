import { QuestionnaryService } from './questionnary.service';
import { QuestionService } from '../../question/service/question.service';
import { Questionnary } from '../entity/questionnary.entity';
import { TestBed } from '@automock/jest';
import { generateTeacherMock } from '../../../test/mock/user.mock';
import { Repository } from 'typeorm';
import { Teacher } from '../../user/entity/teacher.entity';
import { QuestionCreateDto } from '../../question/dto/questionCreate.dto';
import { generateQuestionnaryMock } from '../../../test/mock/questionnary.mock';
import { QuestionnaryMapper } from '../mapper/questionnary.mapper';
import { QuestionType } from '../../question/constants/questionType.constant';
import { QuestionnaryCreateDto } from '../dto/questionnaryCreate.dto';

describe('QuestionnaryService', () => {
  let service: QuestionnaryService;
  let questionnaryRepository: jest.Mocked<Repository<Questionnary>>;
  let questionService: jest.Mocked<QuestionService>;
  let questionnaryMapper: jest.Mocked<QuestionnaryMapper>;
  let mockTeacher: Teacher;
  let mockQuestionnary: Questionnary;

  beforeAll(() => {
    const { unit, unitRef } = TestBed.create(QuestionnaryService).compile();

    service = unit;
    questionService = unitRef.get(QuestionService);
    questionnaryRepository = unitRef.get('QuestionnaryRepository');
    questionnaryMapper = unitRef.get(QuestionnaryMapper);
  });

  beforeEach(() => {
    mockTeacher = generateTeacherMock();
    mockQuestionnary = generateQuestionnaryMock(mockTeacher);
  });

  // createQuestionnary
  describe('createQuestionnary', () => {
    it('should be returned a questionnary', async () => {
      const test: Questionnary = await service.createQuestionnary(
        mockQuestionnary,
        generateTeacherMock(),
      );

      expect(test).not.toEqual(mockQuestionnary);
      expect(test).toBeInstanceOf(Questionnary);
    });
  });

  // createQuestionnaryFromIdArray
  describe('createQuestionnaryFromIdArray', () => {
    it('should be returned a questionnary', async () => {
      questionnaryRepository.findOne.mockResolvedValue(mockQuestionnary);
      questionService.findQuestions.mockResolvedValue(
        mockQuestionnary.questions,
      );
      questionService.findAnswers.mockResolvedValue(
        mockQuestionnary.questions[0].answers,
      );
      questionnaryMapper.entityToQuestionnaryDto.mockReturnValue(
        mockQuestionnary,
      );
      const test: Questionnary = await service.createQuestionnaryFromIdArray(
        [mockQuestionnary.id],
        generateTeacherMock(),
      );
      expect(questionService.findQuestions).toBeCalledWith(mockQuestionnary);
      expect(questionService.findAnswers).toBeCalledWith(
        mockQuestionnary.questions[0].id,
      );
      expect(questionnaryMapper.entityToQuestionnaryDto).toBeCalledWith(
        mockQuestionnary,
      );
      expect(test).not.toEqual(mockQuestionnary);
      expect(test).toBeInstanceOf(Questionnary);
    });
  });

  // deleteQuestionnary
  describe('deleteQuestionnary', () => {
    it('should be returned a boolean and delete questionnary', async () => {
      questionnaryRepository.findOne.mockResolvedValue(mockQuestionnary);
      questionService.deleteQuestions.mockResolvedValue(true);
      const test = await service.deleteQuestionnary(mockQuestionnary.id);
      expect(test).toBeTruthy();
      questionService.deleteQuestions.mockResolvedValue(false);
      questionnaryRepository.findOne.mockResolvedValue(null);
      const test2 = await service.deleteQuestionnary(mockQuestionnary.id);
      expect(test2).toBeFalsy();
    });
  });

  //questionnaryExists
  describe('questionnaryExists', () => {
    it('should be returned a boolean', async () => {
      questionnaryRepository.findOne.mockResolvedValue(mockQuestionnary);
      const test = await service.questionnaryExists(mockQuestionnary.id);
      expect(test).toBeTruthy();
      questionnaryRepository.findOne.mockResolvedValue(null);
      const test2 = await service.questionnaryExists(mockQuestionnary.id);
      expect(test2).toBeFalsy();
    });
  });

  // findQuestionnary
  describe('findQuestionnary', () => {
    it('should be returned a Questionnary', async () => {
      questionnaryRepository.findOne.mockResolvedValue(mockQuestionnary);

      let test = await service.findQuestionnary(mockQuestionnary.id);
      expect(test).toEqual(mockQuestionnary);
      expect(test).toBeInstanceOf(Questionnary);
      expect(test).not.toBeFalsy();

      questionService.findQuestions.mockResolvedValue(
        mockQuestionnary.questions,
      );
      questionnaryRepository.findOne.mockResolvedValue(null);
      test = await service.findQuestionnary(mockQuestionnary.id);
      expect(test).toBeNull();
    });
  });

  //findQuestionnariesFromIdUser
  describe('findQuestionnariesFromIdUser', () => {
    it('should be returned a set of Questionnaries from a user id', async () => {
      questionnaryRepository.find.mockResolvedValue([mockQuestionnary]);
      questionService.findQuestions.mockResolvedValue(
        mockQuestionnary.questions,
      );

      const test = await service.findQuestionnariesFromIdUser(
        generateTeacherMock(),
      );
      expect(test).toBeInstanceOf(Array);
      expect(test).not.toBeFalsy();
    });
  });

  //findQuestionnariesFromIdUserWithQuestions
  describe('findQuestionnariesFromIdUserWithQuestions', () => {
    it('should be returned a set of Questionnaries from a user id', async () => {
      questionnaryRepository.find.mockResolvedValue([mockQuestionnary]);
      questionService.findQuestions.mockResolvedValue(
        mockQuestionnary.questions,
      );

      const test = await service.findQuestionnariesFromIdUserWithQuestions(
        generateTeacherMock(),
      );
      expect(test).toBeInstanceOf(Array);
      expect(test).not.toBeFalsy();
    });
  });

  //findQuestionsFromIdQuestionnary
  describe('findQuestionsFromIdQuestionnary', () => {
    it('should be returned an array of Question', async () => {
      questionnaryRepository.findOne.mockResolvedValue(mockQuestionnary);
      questionService.findQuestions.mockResolvedValue(
        mockQuestionnary.questions,
      );

      let test = await service.findQuestionsFromIdQuestionnary(
        mockQuestionnary.id,
      );
      expect(test).toEqual(mockQuestionnary.questions);
      expect(test).toBeInstanceOf(Array);
      expect(test).not.toBeFalsy();

      questionnaryRepository.findOne.mockResolvedValue(null);
      questionService.findQuestions.mockResolvedValue(null);
      test = await service.findQuestionsFromIdQuestionnary(0);
      expect(test).toBeNull();
    });
  });

  //addQuestion
  describe('addQuestion', () => {
    it('should be returned a question', async () => {
      questionnaryRepository.findOne.mockResolvedValue(mockQuestionnary);
      const question = mockQuestionnary.questions[0];
      questionService.createQuestion.mockResolvedValue(question);
      questionService.findQuestion.mockResolvedValue(question);
      questionService.dtoToQuestion.mockReturnValue(question);
      const teacher = generateTeacherMock();
      const test = await service.addQuestion(
        teacher,
        mockQuestionnary.id,
        question,
      );
      const resultQuestion = question;
      resultQuestion.id = 39;
      expect(test).toEqual(resultQuestion);
      expect(test).toEqual(mockQuestionnary.questions[0]);
    });
  });

  //deleteQuestion
  describe('deleteQuestions', () => {
    it('should be returned a boolean and delete question', async () => {
      const question = mockQuestionnary.questions[0];
      questionService.deleteQuestion.mockResolvedValue(true);
      questionnaryRepository.findOne.mockResolvedValue(mockQuestionnary);
      questionService.dtoToQuestion.mockReturnValue(question);
      const test = await service.deleteQuestion(
        mockQuestionnary.id,
        mockQuestionnary.questions[0].id,
      );
      expect(test).toBeTruthy();
      questionService.deleteQuestion.mockResolvedValue(false);
      const test2 = await service.deleteQuestion(
        mockQuestionnary.id,
        mockQuestionnary.questions[0].id,
      );
      expect(test2).toBeFalsy();
    });
  });

  //modifyQuestion
  describe('modifyQuestion', () => {
    it('should be returned a boolean and modify question', async () => {
      const question = mockQuestionnary.questions[0];
      questionnaryRepository.findOne.mockResolvedValue(mockQuestionnary);
      questionService.modifyQuestion.mockResolvedValue(true);
      questionService.dtoToQuestion.mockReturnValue(question);
      const test = await service.modifyQuestion(
        mockQuestionnary.id,
        mockQuestionnary.questions[0].id,
        new QuestionCreateDto(),
      );
      expect(test).toBeTruthy();
    });
  });

  //modifyQuestionnary
  describe('modifyQuestionnary', () => {
    it('should be returned a boolean and modify question', async () => {
      questionnaryRepository.findOne.mockResolvedValue(mockQuestionnary);
      questionService.modifyQuestion.mockResolvedValue(true);
      const test = await service.modifyQuestionnary(
        mockQuestionnary.id,
        'nouveau titre',
        generateTeacherMock(),
      );
      expect(test).toBeTruthy();
    });
  });

  //dtoToQuestionnary
  describe('dtoToQuestionnary', () => {
    it('should be returned a Questionnary', async () => {
      const questionnaryCreateDto = new QuestionnaryCreateDto();
      questionnaryCreateDto.title = 'titre';
      questionnaryCreateDto.questions = [
        {
          content: 'question',
          type: QuestionType.QCU,
          answers: [
            {
              content: 'réponse',
              isCorrect: false,
            },
          ],
        },
      ];
      questionService.dtoToQuestion.mockReturnValue(
        mockQuestionnary.questions[0],
      );
      const test = service.dtoToQuestionnary(questionnaryCreateDto);
      expect(test).toBeInstanceOf(Questionnary);
    });
  });

  //isQuestionnaryFromTeacher
  describe('isQuestionnaryFromTeacher', () => {
    it('should be returned a boolean', async () => {
      mockQuestionnary.author = mockTeacher;
      mockQuestionnary.author.id = 1;
      questionnaryRepository.findOne.mockResolvedValue(mockQuestionnary);
      mockTeacher.id = 1;
      const test = await service.isQuestionnaryFromTeacher(
        mockQuestionnary.id,
        mockTeacher,
      );
      expect(test).toBeTruthy();
      mockQuestionnary.author.id = 2;
      questionnaryRepository.findOne.mockResolvedValue(mockQuestionnary);
      const teacher = generateTeacherMock();
      teacher.id = 1;
      const test2 = await service.isQuestionnaryFromTeacher(
        mockQuestionnary.id,
        teacher,
      );
      expect(test2).toBeFalsy();
    });
  });

  //findOne
  describe('findOne', () => {
    it('should be returned a Questionnary', async () => {
      questionnaryRepository.findOne.mockResolvedValue(mockQuestionnary);
      const test = await service.findOne(mockQuestionnary.id, []);
      expect(test).toBeInstanceOf(Questionnary);
    });
  });
});
