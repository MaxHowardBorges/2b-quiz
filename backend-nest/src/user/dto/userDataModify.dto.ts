import { IsOptional, IsString } from 'class-validator';

export class UserDataModifyDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  surname?: string;
}
