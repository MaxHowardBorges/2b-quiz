import { HttpException, HttpStatus } from '@nestjs/common';

export class UserAlreadyJoinedException extends HttpException {
  constructor() {
    super('User already joined', HttpStatus.FORBIDDEN);
  }
}
