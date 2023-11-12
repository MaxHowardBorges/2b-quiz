import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidUsernameConfirmationException extends HttpException {
  constructor() {
    super('invalid username confirmation', HttpStatus.FORBIDDEN);
  }
}
