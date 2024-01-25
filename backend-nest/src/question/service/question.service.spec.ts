import { QuestionService } from './question.service';
import { Question } from '../entity/question.entity';
import { Questionnary } from '../../questionnary/entity/questionnary.entity';
import { Answer } from '../entity/answer.entity';
import { generateTeacherMock } from '../../../test/mock/user.mock';
import { TestBed } from '@automock/jest';
import { IsNull, Repository } from 'typeorm';
import {
  generateQuestionnaryMock,
  generateTagMock,
} from '../../../test/mock/questionnary.mock';
import { Teacher } from '../../user/entity/teacher.entity';
import { Tag } from '../entity/tag.entity';
import { TagDto } from '../dto/tag.dto';
import { QuestionCreateDto } from '../dto/questionCreate.dto';

describe('QuestionService', () => {
  let service: QuestionService;
  let questionRepository: jest.Mocked<Repository<Question>>;
  let answerRepository: jest.Mocked<Repository<Answer>>;
  let tagRepository: jest.Mocked<Repository<Tag>>;

  let questionnaryMock: Questionnary;
  let questionsMock: Question[];
  let teacher: Teacher;
  let tagMock: Tag;

  beforeAll(() => {
    const { unit, unitRef } = TestBed.create(QuestionService).compile();
    service = unit;
    questionRepository = unitRef.get('QuestionRepository');
    answerRepository = unitRef.get('AnswerRepository');
    tagRepository = unitRef.get('TagRepository');
  });

  beforeEach(() => {
    teacher = generateTeacherMock(false, true);
    questionnaryMock = generateQuestionnaryMock(teacher);
    questionsMock = questionnaryMock.questions;
    tagMock = generateTagMock(teacher);
  });

  //createTag
  describe('createTag', () => {
    it('should create a tag', async () => {
      const tagDto = new TagDto();
      tagDto.description = tagMock.description;
      tagRepository.save.mockResolvedValue(tagMock);
      const tag = await service.createTag(teacher, tagDto);
      expect(tag).toBeDefined();
      expect(tag.description).toEqual(tagMock.description);
      expect(tagRepository.save).toHaveBeenCalledWith(tag);
    });
  });

  //updateTag
  describe('updateTag', () => {
    it('should update a tag', async () => {
      const newTag = new TagDto();
      newTag.description = tagMock.description;
      tagRepository.findOne.mockResolvedValue(tagMock);
      tagRepository.save.mockResolvedValue(tagMock);
      const isUpdated = await service.updateTag(tagMock.idTag, newTag);
      expect(isUpdated).toBeTruthy();
      expect(tagRepository.findOne).toHaveBeenCalledWith({
        where: { idTag: tagMock.idTag },
      });
      expect(tagRepository.save).toHaveBeenCalledWith(tagMock);
    });
    it('should not update a tag', async () => {
      const newTag = new TagDto();
      newTag.description = tagMock.description;
      tagRepository.findOne.mockResolvedValue(undefined);
      const isUpdated = await service.updateTag(tagMock.idTag, newTag);
      expect(isUpdated).toBeFalsy();
      expect(tagRepository.findOne).toHaveBeenCalledWith({
        where: { idTag: tagMock.idTag },
      });
    });
  });

  //deleteTag
  describe('deleteTag', () => {
    it('should delete a tag', async () => {
      tagRepository.findOne.mockResolvedValue(tagMock);
      tagRepository.delete.mockResolvedValue(undefined);
      const isDeleted = await service.deleteTag(tagMock.idTag);
      expect(isDeleted).toBeTruthy();
      expect(tagRepository.findOne).toHaveBeenCalledWith({
        where: { idTag: tagMock.idTag },
        relations: ['questions', 'author'],
      });
      expect(tagRepository.delete).toHaveBeenCalledWith({
        idTag: tagMock.idTag,
      });
    });
  });

  //getTag
  describe('getTag', () => {
    it('should get a tag', async () => {
      tagRepository.findOne.mockResolvedValue(tagMock);
      const tag = await service.getTag(tagMock.idTag);
      expect(tag).toBeDefined();
      expect(tag).toEqual(tagMock);
      expect(tagRepository.findOne).toHaveBeenCalledWith({
        where: { idTag: tagMock.idTag },
        relations: ['questions'],
      });
    });
  });

  //getTags
  describe('getTags', () => {
    it('should get tags', async () => {
      tagRepository.find.mockResolvedValue([tagMock]);
      const tags = await service.getTags(teacher);
      expect(tags).toBeDefined();
      expect(tags).toEqual([tagMock]);
      expect(tagRepository.find).toHaveBeenCalledWith({
        where: { author: { id: teacher.id } },
        relations: ['questions'],
      });
    });
  });

  //checkQuestionContainingAnswer
  describe('checkQuestionContainingAnswer', () => {
    it('should check if a question contains an answer', async () => {
      const question = questionsMock[0];
      question.id = 1;
      const answer = question.answers[0];
      answer.id = 1;
      answer.question = question;
      answerRepository.findOne.mockResolvedValue(answer);
      const isContaining = await service.checkQuestionContainingAnswer(
        question,
        answer.id,
      );
      expect(isContaining).toBeTruthy();
      expect(answerRepository.findOne).toHaveBeenCalledWith({
        where: { id: answer.id },
        relations: ['question'],
      });
    });
  });

  //createAnswerOpenEnded
  describe('createAnswerOpenEnded', () => {
    it('should create an open ended answer', async () => {
      const answer = questionsMock[0].answers[0];
      const answerOpenEnded = new Answer();
      answerOpenEnded.content = answer.content;
      answerOpenEnded.isCorrect = true;
      answerOpenEnded.question = answer.question;
      answerRepository.save.mockResolvedValue(answer);
      const answerDB = await service.createAnswerOpenEnded(answer);
      expect(answerDB).toBeDefined();
      expect(answerDB.content).toEqual(answer.content);
      expect(answerDB.question).toEqual(answer.question);
      expect(answerDB.isCorrect).toBeTruthy();
      expect(answerRepository.save).toHaveBeenCalledWith(answerOpenEnded);
    });
  });

  //createQuestion
  describe('createQuestion', () => {
    it('should create a question', async () => {
      questionnaryMock = new Questionnary();
      questionnaryMock.questions = [];
      const question = questionsMock[0];
      for (const answer of question.answers) {
        answer.id = undefined;
        answer.question = question;
      }
      question.questionnary = questionnaryMock;
      const partialQuestion = new Question();
      partialQuestion.answers = undefined;
      partialQuestion.content = question.content;
      partialQuestion.type = question.type;
      partialQuestion.author = question.author;
      partialQuestion.originalId = question.originalId;
      partialQuestion.questionnary = questionnaryMock;
      partialQuestion.originalQuestion = undefined;
      partialQuestion.id = undefined;
      partialQuestion.tags = undefined;

      const partialAnswer = new Answer();
      partialAnswer.content = question.answers[0].content;
      partialAnswer.isCorrect = question.answers[0].isCorrect;
      partialAnswer.question = partialQuestion;

      questionRepository.save.mockResolvedValue(question);
      answerRepository.save.mockResolvedValue(question.answers[0]);
      const questionDB = await service.createQuestion(
        question,
        questionnaryMock,
      );
      expect(questionDB).toBeDefined();
      expect(questionDB.content).toEqual(question.content);
      expect(questionDB.type).toEqual(question.type);
      expect(questionDB.questionnary).toEqual(questionnaryMock);
      expect(questionDB.author).toEqual(question.author);
      expect(questionRepository.save).toHaveBeenCalledWith(partialQuestion);
      expect(answerRepository.save).toHaveBeenCalledWith(partialAnswer);
    });
  });

  //deleteQuestions
  describe('deleteQuestions', () => {
    it('should delete questions', async () => {
      questionRepository.find.mockResolvedValue(questionsMock);
      answerRepository.delete.mockResolvedValue(undefined);
      questionRepository.delete.mockResolvedValue(undefined);
      const isDeleted = await service.deleteQuestions(questionnaryMock);
      expect(isDeleted).toBeTruthy();
      expect(questionRepository.find).toHaveBeenCalledWith({
        where: { questionnary: { id: questionnaryMock.id } },
      });
      expect(answerRepository.delete).toHaveBeenCalledWith({
        question: { id: questionsMock[0].id },
      });
      expect(questionRepository.delete).toHaveBeenCalledWith({
        questionnary: { id: questionnaryMock.id },
      });
    });
    it('should not delete questions', async () => {
      questionRepository.find.mockResolvedValue(undefined);
      const isDeleted = await service.deleteQuestions(questionnaryMock);
      expect(isDeleted).toBeFalsy();
      expect(questionRepository.find).toHaveBeenCalledWith({
        where: { questionnary: { id: questionnaryMock.id } },
      });
    });
  });

  //modifyQuestion
  describe('modifyQuestion', () => {
    it('should modify a question', async () => {
      const question = questionsMock[0];
      question.id = 1;
      questionnaryMock.id = 1;
      questionRepository.findOne.mockResolvedValue(question);
      questionRepository.save.mockResolvedValue(question);
      const isModified = await service.modifyQuestion(
        question,
        questionnaryMock,
        1,
      );
      expect(isModified).toBeTruthy();
      expect(questionRepository.findOne).toHaveBeenCalledWith({
        where: { id: question.id, questionnary: { id: questionnaryMock.id } },
        relations: ['answers', 'tags'],
      });
      expect(questionRepository.save).toHaveBeenCalledWith(question);
    });
    it('should not modify a question', async () => {
      const question = questionsMock[0];
      question.id = 1;
      questionnaryMock.id = 1;
      questionRepository.findOne.mockResolvedValue(undefined);
      const isModified = await service.modifyQuestion(
        question,
        questionnaryMock,
        1,
      );
      expect(isModified).toBeFalsy();
      expect(questionRepository.findOne).toHaveBeenCalledWith({
        where: { id: question.id, questionnary: { id: questionnaryMock.id } },
        relations: ['answers', 'tags'],
      });
    });
  });

  //getQuestionPrivateBank
  describe('getQuestionPrivateBank', () => {
    it('should get a question from private bank', async () => {
      const question = questionsMock[0];
      question.id = 1;
      questionRepository.find.mockResolvedValue([question]);
      const questionDB = await service.getQuestionPrivateBank(teacher);
      expect(questionDB).toBeDefined();
      expect(questionDB).toEqual([question]);
      expect(questionRepository.find).toHaveBeenCalledWith({
        where: { author: { id: teacher.id }, originalId: IsNull() },
        relations: ['answers', 'questionnary', 'tags'],
      });
    });
  });

  //questionExists
  describe('questionExists', () => {
    it('should check if a question exists', async () => {
      const question = questionsMock[0];
      question.id = 1;
      questionRepository.findOne.mockResolvedValue(question);
      const isExisting = await service.questionExists(question.id);
      expect(isExisting).toBeTruthy();
      expect(questionRepository.findOne).toHaveBeenCalledWith({
        where: { id: question.id },
        relations: ['answers', 'tags'],
      });
    });
    it('should check if a question exists', async () => {
      const question = questionsMock[0];
      question.id = 1;
      questionRepository.findOne.mockResolvedValue(undefined);
      const isExisting = await service.questionExists(question.id);
      expect(isExisting).toBeFalsy();
      expect(questionRepository.findOne).toHaveBeenCalledWith({
        where: { id: question.id },
        relations: ['answers', 'tags'],
      });
    });
  });

  //tagExists
  describe('tagExists', () => {
    it('should check if a tag exists', async () => {
      tagRepository.findOne.mockResolvedValue(tagMock);
      const isExisting = await service.tagExists(tagMock.idTag);
      expect(isExisting).toBeTruthy();
      expect(tagRepository.findOne).toHaveBeenCalledWith({
        where: { idTag: tagMock.idTag },
      });
    });
    it('should check if a tag exists', async () => {
      tagRepository.findOne.mockResolvedValue(undefined);
      const isExisting = await service.tagExists(tagMock.idTag);
      expect(isExisting).toBeFalsy();
      expect(tagRepository.findOne).toHaveBeenCalledWith({
        where: { idTag: tagMock.idTag },
      });
    });
  });

  describe('isQuestionFromTeacher', () => {
    it('should check if a question is from a teacher', async () => {
      const question = questionsMock[0];
      question.id = 1;
      questionRepository.findOne.mockResolvedValue(question);
      const isFromTeacher = await service.isQuestionFromTeacher(
        question.id,
        teacher,
      );
      expect(isFromTeacher).toBeTruthy();
      expect(questionRepository.findOne).toHaveBeenCalledWith({
        where: { id: question.id },
        relations: ['author'],
      });
    });
    it('should check if a question is from a teacher', async () => {
      const question = questionsMock[0];
      question.id = 1;
      question.author = generateTeacherMock(false, true);
      questionRepository.findOne.mockResolvedValue(undefined);
      const isFromTeacher = await service.isQuestionFromTeacher(
        question.id,
        teacher,
      );
      expect(isFromTeacher).toBeFalsy();
      expect(questionRepository.findOne).toHaveBeenCalledWith({
        where: { id: question.id },
        relations: ['author'],
      });
    });
  });

  //findOneQuestion
  describe('findOneQuestion', () => {
    it('should get a question', async () => {
      const question = questionsMock[0];
      question.id = 1;
      questionRepository.findOne.mockResolvedValue(question);
      const questionDB = await service.findOneQuestion(question.id, ['author']);
      expect(questionDB).toBeDefined();
      expect(questionDB).toEqual(question);
      expect(questionRepository.findOne).toHaveBeenCalledWith({
        where: { id: question.id },
        relations: ['author'],
      });
    });
  });

  //isTagFromTeacher
  describe('isTagFromTeacher', () => {
    it('should check if a tag is from a teacher', async () => {
      tagRepository.findOne.mockResolvedValue(tagMock);
      const isFromTeacher = await service.isTagFromTeacher(
        tagMock.idTag,
        teacher,
      );
      expect(isFromTeacher).toBeTruthy();
      expect(tagRepository.findOne).toHaveBeenCalledWith({
        where: { idTag: tagMock.idTag },
        relations: ['author'],
      });
    });
  });

  //findOneTag
  describe('findOneTag', () => {
    it('should get a tag', async () => {
      tagRepository.findOne.mockResolvedValue(tagMock);
      const tag = await service.findOneTag(tagMock.idTag, ['author']);
      expect(tag).toBeDefined();
      expect(tag).toEqual(tagMock);
      expect(tagRepository.findOne).toHaveBeenCalledWith({
        where: { idTag: tagMock.idTag },
        relations: ['author'],
      });
    });
  });

  //dtoToQuestion
  describe('dtoToQuestion', () => {
    it('should convert a dto to a question', async () => {
      const question = questionsMock[0];
      const questionCreateDto = new QuestionCreateDto();
      const newQuestion = new Question();
      newQuestion.id = null;
      newQuestion.content = question.content;
      newQuestion.type = question.type;
      newQuestion.answers = question.answers;
      newQuestion.originalId = null;
      newQuestion.tags = [];
      newQuestion.questionnary = questionnaryMock;
      questionCreateDto.content = question.content;
      questionCreateDto.type = question.type;
      questionCreateDto.tags = [];
      questionCreateDto.answers = question.answers;

      questionRepository.findOne.mockResolvedValue(question);
      const questionDB = service.dtoToQuestion(
        questionCreateDto,
        questionnaryMock,
      );
      questionDB.answers = newQuestion.answers;
      newQuestion.answers = questionDB.answers;
      expect(questionDB).toBeDefined();
      expect(questionDB).toEqual(newQuestion);
    });
  });

  //dtoToAnswer
  describe('dtoToAnswer', () => {
    it('should convert a dto to an answer', async () => {
      const answer = questionsMock[0].answers[0];
      answer.id = null;
      answer.question = questionsMock[0];

      answerRepository.findOne.mockResolvedValue(answer);
      const answerDB = service.dtoToAnswer(answer, questionsMock[0]);
      expect(answerDB).toBeDefined();
      expect(answerDB).toEqual(answer);
    });
  });

  //dtoToTag
  describe('dtoToTag', () => {
    it('should convert a dto to a tag', async () => {
      tagRepository.findOne.mockResolvedValue(tagMock);
      tagMock.idTag = undefined;
      tagMock.author = undefined;
      tagMock.questions = undefined;
      const tag = service.dtoToTag(tagMock);
      expect(tag).toBeDefined();
      expect(tag).toEqual(tagMock);
      expect(tagRepository.findOne).toHaveBeenCalledWith({
        where: { idTag: tagMock.idTag },
      });
    });
  });

  //modifyQuestionsOriginalId
  describe('modifyQuestionsOriginalId', () => {
    it('should modify questions original id', async () => {
      questionsMock[0].id = 1;
      questionRepository.find.mockResolvedValue(questionsMock);
      await service.modifyQuestionsOriginalId(questionsMock[0].id);
      expect(questionRepository.find).toHaveBeenCalledWith({
        where: { originalId: questionsMock[0].id },
      });
      expect(questionRepository.save).toHaveBeenCalledWith(questionsMock[0]);
    });
    it('should not modify questions original id', async () => {
      questionRepository.find.mockResolvedValue([]);
      questionsMock[0].id = 1;
      const isModified = await service.modifyQuestionsOriginalId(
        questionsMock[0].id,
      );
      expect(isModified).toBeFalsy();
      expect(questionRepository.find).toHaveBeenCalledWith({
        where: { originalId: questionsMock[0].id },
      });
    });
  });

  //findQuestions
  describe('findQuestions', () => {
    it('should find questions', async () => {
      const questionnary = generateQuestionnaryMock(teacher);
      questionnary.id = 1;
      questionRepository.find.mockResolvedValue(questionsMock);
      const questions = await service.findQuestions(questionnary);
      expect(questions).toBeDefined();
      expect(questions).toEqual(questionsMock);
      expect(questionRepository.find).toHaveBeenCalledWith({
        where: { questionnary: { id: questionnary.id } },
        relations: ['tags'],
      });
    });
  });

  //findAnswers
  describe('findAnswers', () => {
    it('should find answers', async () => {
      const question = questionsMock[0];
      question.id = 1;
      questionRepository.findOne.mockResolvedValue(question);
      const answers = await service.findAnswers(question.id);
      const returnedAnswers = [];
      for (const answer of answers) {
        const answerR = new Answer();
        answerR.id = answer.id;
        answerR.content = answer.content;
        answerR.isCorrect = answer.isCorrect;
        answerR.question = null;
        returnedAnswers.push(answerR);
      }
      expect(answers).toBeDefined();
      expect(answers).toEqual(returnedAnswers);
      expect(questionRepository.findOne).toHaveBeenCalledWith({
        where: { id: question.id },
        relations: ['answers'],
      });
    });
  });

  //deleteQuestion
  describe('deleteQuestion', () => {
    it('should delete a question', async () => {
      const questionnary = generateQuestionnaryMock(teacher);
      const question = questionsMock[0];
      question.id = 1;
      questionRepository.findOne.mockResolvedValueOnce(question);
      questionRepository.delete.mockResolvedValue(undefined);
      questionRepository.find.mockResolvedValueOnce(questionsMock);
      const isDeleted = await service.deleteQuestion(questionnary, question.id);
      expect(isDeleted).toBeTruthy();
      expect(questionRepository.findOne).toHaveBeenCalledWith({
        where: { questionnary: { id: questionnary.id }, id: question.id },
      });
      expect(questionRepository.delete).toHaveBeenCalledWith({
        questionnary: { id: questionnary.id },
        id: question.id,
      });
    });
    it('should not delete a question', async () => {
      const questionnary = generateQuestionnaryMock(teacher);
      const question = questionsMock[0];
      question.id = 1;
      questionRepository.findOne.mockResolvedValue(undefined);
      const isDeleted = await service.deleteQuestion(questionnary, question.id);
      expect(isDeleted).toBeFalsy();
      expect(questionRepository.findOne).toHaveBeenCalledWith({
        where: { questionnary: { id: questionnary.id }, id: question.id },
      });
    });
  });
});
