import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { AnswerCreateDto } from './answerCreate.dto';
import { QuestionType } from '../constants/questionType.constant';

export class QuestionCreateDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  type: QuestionType = QuestionType.QCU;

  @IsNotEmpty({ each: true })
  @ValidateNested({ each: true })
  @Type(() => AnswerCreateDto)
  answers: AnswerCreateDto[];
}
