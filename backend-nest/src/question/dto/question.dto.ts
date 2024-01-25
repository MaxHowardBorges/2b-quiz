import { AnswerDto } from './answer.dto';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { QuestionType } from '../constants/questionType.constant';
import { TagDto } from './tag.dto';

export class QuestionDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  type: QuestionType;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => TagDto)
  tags?: TagDto[];

  @IsNotEmpty({ each: true })
  @ValidateNested({ each: true })
  @Type(() => AnswerDto)
  answers: AnswerDto[];

  @IsOptional()
  @IsNumber()
  questionnaryId?: number;

  @IsOptional()
  @IsNumber()
  originalId?: number;
}
