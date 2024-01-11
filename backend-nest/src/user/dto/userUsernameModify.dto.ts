import { IsNotEmpty, IsString } from 'class-validator';

export class UserUsernameModifyDto {
  @IsString()
  @IsNotEmpty()
  username: string;
}
