import { HttpException, HttpStatus } from '@nestjs/common';

export class UserNotValidatedException extends HttpException {
  constructor() {
    super('user not validated', HttpStatus.FORBIDDEN);
  }
}
