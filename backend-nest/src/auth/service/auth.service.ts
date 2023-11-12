import { Injectable } from '@nestjs/common';
import { UserNotFoundException } from '../exception/userNotFound.exception';
import { InvalidPasswordException } from '../exception/invalidPassword.exception';
import { UserService } from '../../user/service/user.service';
import { BcryptService } from '../../bcrypt/service/bcrypt.service';
import { JwtService } from '@nestjs/jwt';
import { UserNotValidatedException } from '../exception/userNotValidated.exception';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly bcryptService: BcryptService,
    private readonly jwtService: JwtService,
  ) {}
  async signIn(username: string, pass: string) {
    const user = await this.userService.getUserByUsername(username, false);
    if (!user) throw new UserNotFoundException();
    if (!(await this.bcryptService.validatePassword(pass, user.password)))
      throw new InvalidPasswordException();
    if (!user.validate) throw new UserNotValidatedException();
    const userPayload = {
      id: user.id,
      username: user.username,
    };
    return {
      access_token: await this.jwtService.signAsync(userPayload),
    };
  }
}
