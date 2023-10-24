import { Test, TestingModule } from '@nestjs/testing';
import { QuestionController } from './question.controller';
import { QuestionService } from '../service/question.service';
import { Question } from '../entity/question.entity';
import { QuestionModule } from '../question.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Answer } from '../entity/answer.entity';
import { UserUpdateDto } from '../dto/idSession.dto';

describe('QuestionController', () => {
  let controller: QuestionController;
  let service: QuestionService;

  const mockQuestionService = {
    findAll: jest.fn(),
    findAllWithQuestion: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuestionController],
      providers: [QuestionService],
      //imports: [QuestionModule],
    })
      .overrideProvider(QuestionService)
      .useValue(mockQuestionService)
      .compile();

    controller = await module.resolve(QuestionController);
    service = await module.resolve(QuestionService);
  });

  describe('findAll', () => {
    it('should be returned an array of questions', async () => {
      const result: Question[] = [
        {
          id: 1,
          content: 'Test Question 1?',
          answers: [
            {
              id: 1,
              content: 'Answer 1 to Question 1',
              isCorrect: true,
              question: null,
            },
            {
              id: 2,
              content: 'Answer 2 to Question 1',
              isCorrect: false,
              question: null,
            },
          ],
        },
        {
          id: 2,
          content: 'Test Question 2?',
          answers: [
            {
              id: 3,
              content: 'Answer 1 to Question 2',
              isCorrect: true,
              question: null,
            },
          ],
        },
      ];
      mockQuestionService.findAllWithQuestion.mockResolvedValue(result);
      const test = await controller.findAll();

      expect(test).toEqual(result);
    });
  });

  describe('nextQuestion', () => {
    it('should be returned an array of questions', async () => {
      const result: Question = {
        id: 1,
        content: 'Test Question 1?',
        answers: [
          {
            id: 1,
            content: 'Answer 1 to Question 1',
            isCorrect: true,
            question: null,
          },
          {
            id: 2,
            content: 'Answer 2 to Question 1',
            isCorrect: false,
            question: null,
          },
        ],
      };
      const mockUserUpdateDto = {
        id: 42,
      };
      const userUpdateDto = new UserUpdateDto();
      userUpdateDto.id = mockUserUpdateDto.id;
      mockQuestionService.findOne.mockResolvedValue(result);
      const test = await controller.nextQuestion(userUpdateDto);

      expect(test).toEqual(result);
    });
  });
});
