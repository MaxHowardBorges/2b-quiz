import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class AnswerDto {

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsBoolean()
  @IsNotEmpty()
  isCorrect: boolean;
}
