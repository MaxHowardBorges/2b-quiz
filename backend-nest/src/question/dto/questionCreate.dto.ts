import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { AnswerCreateDto } from './answerCreate.dto';

export class QuestionCreateDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsNotEmpty({ each: true })
  @ValidateNested({ each: true })
  @Type(() => AnswerCreateDto)
  answers: AnswerCreateDto[];
}
