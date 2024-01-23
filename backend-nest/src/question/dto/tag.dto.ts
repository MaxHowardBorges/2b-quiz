import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class TagDto {
  @IsNumber()
  @IsOptional()
  idTag: number;

  @IsString()
  @IsNotEmpty()
  description: string;
}
