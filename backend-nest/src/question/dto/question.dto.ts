import { AnswerDto } from './answer.dto';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { QuestionType } from '../constants/questionType.constant';

export class QuestionDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsNotEmpty({ each: true })
  @ValidateNested({ each: true })
  @Type(() => AnswerDto)
  answers: AnswerDto[];

  @IsNotEmpty()
  type: QuestionType;
}
