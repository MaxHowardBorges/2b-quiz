import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateSessionDto {
  //@IsNumber()
  @IsNotEmpty()
  idsQuestionnarys: number[];
  @IsBoolean()
  @IsNotEmpty()
  isResult: boolean;
  @IsBoolean()
  @IsNotEmpty()
  isGlobal: boolean;
  @IsBoolean()
  @IsNotEmpty()
  isAvailableAfter: boolean;
}
