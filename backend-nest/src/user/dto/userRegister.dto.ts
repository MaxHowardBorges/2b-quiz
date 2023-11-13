import { UserType } from '../constants/userType.constant';
import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { Match } from '../../decorators/match.decorator';

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
  @IsNotEmpty()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message: 'password too weak',
    },
  ) // Password must be at least 8 characters long and must contain 1 uppercase letter, 1 lowercase letter, 1 number and 1 non-word character (@,$,!,%,*,?,&)
  password: string;

  @IsString()
  @IsNotEmpty()
  @Match('password', {
    message: "passwords don't match",
  })
  passwordConfirm: string;

  @IsString()
  @Matches(new RegExp(`^(${UserType.STUDENT}|${UserType.TEACHER})$`), {
    message: 'userType must be a teacher or a student',
  })
  userType: UserType.STUDENT | UserType.TEACHER;
}
