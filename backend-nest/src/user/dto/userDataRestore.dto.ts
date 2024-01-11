import { IsString } from 'class-validator';

export class UserDataRestoreDto {
  @IsString()
  name: string;

  @IsString()
  surname: string;
}
