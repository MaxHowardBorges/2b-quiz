import { AnswerQuestionDto } from './answerQuestion.dto';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { AnswerStudentDto } from '../../question/dto/answerStudent.dto';

export class UserAnswerDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsNotEmpty({ each: true })
  @ValidateNested({ each: true })
  @Type(() => AnswerStudentDto)
  tab: AnswerQuestionDto[];
}
