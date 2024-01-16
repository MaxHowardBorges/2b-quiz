import { HttpException, HttpStatus } from '@nestjs/common';

export class UserNotFoundException extends HttpException {
  constructor() {
    super('user not found', HttpStatus.FORBIDDEN);
  }
}
