import { IsNotEmpty, IsString } from 'class-validator';

export class RespondQuestionDto {
  @IsString()
  @IsNotEmpty()
  idSession: string;

  @IsNotEmpty()
  answer: number | string | number[];

  @IsString()
  @IsNotEmpty()
  username: string;
}
