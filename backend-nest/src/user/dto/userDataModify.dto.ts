import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UserDataModifyDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  surname?: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
