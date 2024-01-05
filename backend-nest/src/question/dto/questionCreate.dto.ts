import { IsEnum, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { AnswerCreateDto } from './answerCreate.dto';
import { QuestionType } from '../constants/questionType.constant';

export class QuestionCreateDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsEnum(QuestionType)
  @IsNotEmpty()
  type: QuestionType;

  @IsNotEmpty({ each: true })
  @ValidateNested({ each: true })
  @Type(() => AnswerCreateDto)
  answers: AnswerCreateDto[];
}
