import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class AnswerCreateDto {

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsBoolean()
  @IsNotEmpty()
  isCorrect: boolean;
}
