import { HttpException, HttpStatus } from '@nestjs/common';

export class UserUnauthorisedException extends HttpException {
  constructor() {
    super('User unauthorised', HttpStatus.UNAUTHORIZED);
  }
}
