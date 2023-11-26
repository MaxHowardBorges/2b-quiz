import { Injectable } from '@nestjs/common';
import { UserNotFoundException } from '../exception/userNotFound.exception';
import { InvalidTicketException } from '../exception/invalidTicket.exception';
import { UserService } from '../../user/service/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../user/entity/user.entity';
import { CasService } from '../../cas/service/cas.service';
import { UnsupportedCasProtocolException } from '../../cas/exception/unsupportedCasProtocol.exception';
import { CasServerErrorException } from '../../cas/exception/casServerError.exception';
import { CasUnavailableException } from '../exception/casUnavailable.exception';
import { TicketValidationErrorException } from '../../cas/exception/ticketValidationError.exception';

@Injectable()
export class AuthService {
  constructor(
    private readonly casService: CasService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async signIn(ticket: string, service: string) {
    let username: string;
    try {
      username = await this.casService.validateTicket(service, ticket);
    } catch (err) {
      if (err instanceof TicketValidationErrorException)
        throw new InvalidTicketException();
      else if (
        err instanceof UnsupportedCasProtocolException ||
        err instanceof CasServerErrorException
      )
        throw new CasUnavailableException();
      else throw new CasUnavailableException();
    }

    const user = await this.userService.getUserForLogin(username);
    const userPayload = {
      id: user.id,
      username: user.username,
    };
    return {
      access_token: await this.jwtService.signAsync(userPayload),
    };
  }
  async renewToken(user: User) {
    const userTest = await this.userService.getUserByUsername(
      user.username,
      false,
    );
    if (!userTest) throw new UserNotFoundException();
    const userPayload = {
      id: user.id,
      username: user.username,
    };
    return {
      access_token: await this.jwtService.signAsync(userPayload),
    };
  }

  async signInDev(username: string) {
    const user = await this.userService.getUserForLogin(username);
    const userPayload = {
      id: user.id,
      username: user.username,
    };
    return {
      access_token: await this.jwtService.signAsync(userPayload),
    };
  }
}
