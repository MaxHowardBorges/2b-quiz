import { UserType } from '../constants/userType.constant';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class UserSelfValidateDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  surname: string;

  @IsString()
  @Matches(new RegExp(`^(${UserType.STUDENT}|${UserType.TEACHER})$`), {
    message: 'userType must be a teacher or a student',
  })
  userType: UserType.STUDENT | UserType.TEACHER;
}
