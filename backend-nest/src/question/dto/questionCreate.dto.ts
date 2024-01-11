import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AnswerCreateDto } from './answerCreate.dto';
import { QuestionType } from '../constants/questionType.constant';
import { TagDto } from './tag.dto';

export class QuestionCreateDto {
  @IsNumber()
  @IsOptional()
  id?: number;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsEnum(QuestionType)
  @IsNotEmpty()
  type: QuestionType;

  @IsNotEmpty()
  author: number = 111111; //TODO IMPLEMENT USER ENTITY

  @IsNotEmpty({ each: true })
  @ValidateNested({ each: true })
  @Type(() => AnswerCreateDto)
  answers: AnswerCreateDto[];

  @ValidateNested({ each: true })
  @Type(() => TagDto)
  tags: TagDto[];
}
