import { IsNotEmpty, IsNumber, isString, IsString } from 'class-validator';

export class RespondQuestionDto {
  @IsString()
  @IsNotEmpty()
  idSession: string;

  @IsNotEmpty()
  answer: number | string;

  @IsString()
  @IsNotEmpty()
  username: string;
}
