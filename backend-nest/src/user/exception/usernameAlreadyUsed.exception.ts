import { HttpException, HttpStatus } from '@nestjs/common';

export class UsernameAlreadyUsedException extends HttpException {
  constructor() {
    super('username already used exception', HttpStatus.BAD_REQUEST);
  }
}
