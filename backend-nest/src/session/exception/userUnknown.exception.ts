import { HttpException, HttpStatus } from '@nestjs/common';

export class UserUnknownException extends HttpException {
  constructor() {
    super('User unknown', HttpStatus.FORBIDDEN);
  }
}
