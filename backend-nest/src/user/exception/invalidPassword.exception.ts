import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidPasswordException extends HttpException {
  constructor() {
    super('invalid password', HttpStatus.FORBIDDEN);
  }
}
