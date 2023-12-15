import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AnswerDto {

  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsBoolean()
  @IsNotEmpty()
  isCorrect: boolean;
}
