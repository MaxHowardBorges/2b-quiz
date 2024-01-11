import { HttpException, HttpStatus } from '@nestjs/common';

export class NotValidatedUserException extends HttpException {
  constructor() {
    super('not validated user exception', HttpStatus.FORBIDDEN);
  }
}
