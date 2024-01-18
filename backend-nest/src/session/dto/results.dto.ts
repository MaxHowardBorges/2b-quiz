import { Question } from '../../question/entity/question.entity';
import { notNull } from 'jest-mock-extended';
import { IsNotEmpty } from 'class-validator';
import { UserAnswerDto } from './userAnswer.dto';
import { QuestionResultDto } from './questionResult.dto';

export class ResultsDto {
  personnalResult: number;

  questions: QuestionResultDto[];

  isGlobal: number;
}
