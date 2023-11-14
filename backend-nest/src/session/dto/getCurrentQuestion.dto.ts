import { IsNotEmpty, IsString } from 'class-validator';

export class GetCurrentQuestionDto {
  @IsString()
  @IsNotEmpty()
  idSession: string;
}
