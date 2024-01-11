import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { Match } from '../../decorators/match.decorator';

export class UserPasswordModifyDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).{8,}$/, {
    message: 'new password too weak',
  }) // Password must be at least 8 characters long and must contain 1 uppercase letter, 1 lowercase letter and or 1 number or 1 non-word character
  newPassword: string;

  @IsString()
  @IsNotEmpty()
  @Match('newPassword', {
    message: "passwords don't match",
  })
  newPasswordConfirm: string;

  @IsString()
  @IsNotEmpty()
  oldPassword: string;
}
