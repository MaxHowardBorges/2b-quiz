import { AnswerStudentDto } from '../../question/dto/answerStudent.dto';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { QuestionType } from '../../question/constants/questionType.constant';

export class CurrentQuestionDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsNotEmpty({ each: true })
  @ValidateNested({ each: true })
  @Type(() => AnswerStudentDto)
  answers: AnswerStudentDto[];

  @IsNotEmpty()
  type: QuestionType;
}
