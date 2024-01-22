import { HttpException, HttpStatus } from '@nestjs/common';

export class SessionClosedException extends HttpException {
  constructor() {
    super('This session is closed', HttpStatus.METHOD_NOT_ALLOWED);
  }
}
