import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { QuestionCreateDto } from '../../question/dto/questionCreate.dto';

export class QuestionnaryCreateDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNotEmpty({ each: true })
  @ValidateNested({ each: true })
  @Type(() => QuestionCreateDto)
  questions: QuestionCreateDto[];
}
