import { QuestionDto } from '../../question/dto/question.dto';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class PrivateQuestionnaryDto {
  @IsNotEmpty({ each: true })
  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  questions: QuestionDto[];
}
