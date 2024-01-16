import { Question } from '../../question/entity/question.entity';
import { notNull } from 'jest-mock-extended';
import { IsNotEmpty } from 'class-validator';
import { UserAnswerDto } from './userAnswer.dto';

export class ResultsDto {
  @IsNotEmpty()
  question: Question[];

  answersDto: UserAnswerDto[];
}
