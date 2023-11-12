import { IsNotEmpty, IsString } from 'class-validator';

export class UserSelfDeleteDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
