import { IsNotEmpty, IsNumber } from 'class-validator';

export class AnswerQuestionDto {
  @IsNumber()
  @IsNotEmpty()
  idQuestion: number;

  @IsNumber()
  @IsNotEmpty()
  idAnswer: number | string | number[];
}
