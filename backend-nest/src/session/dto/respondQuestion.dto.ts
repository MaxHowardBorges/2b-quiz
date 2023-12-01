import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class RespondQuestionDto {
  @IsString()
  @IsNotEmpty()
  idSession: string;

  @IsNumber()
  @IsNotEmpty()
  answer: number;

  @IsString()
  @IsNotEmpty()
  username: string;
}
