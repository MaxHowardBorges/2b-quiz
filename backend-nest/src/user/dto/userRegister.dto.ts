import { UserType } from '../constants/userType.constant';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class UserRegisterDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  surname: string;

  @IsString()
  @Matches(
    new RegExp(`^(${UserType.STUDENT}|${UserType.TEACHER}|${UserType.ADMIN})$`),
    {
      message: 'userType must be a teacher or a student or an admin',
    },
  )
  userType: UserType.STUDENT | UserType.TEACHER | UserType.ADMIN;
}
