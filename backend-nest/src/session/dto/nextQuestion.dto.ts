import { IsNotEmpty, IsString } from 'class-validator';

export class NextQuestionDto {
  @IsString()
  @IsNotEmpty()
  idSession: string;
}
