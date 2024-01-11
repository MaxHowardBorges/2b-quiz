import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class TagDto {
  @IsNumber()
  @IsNotEmpty()
  idTag: number;

  @IsString()
  @IsNotEmpty()
  description: string;
}
