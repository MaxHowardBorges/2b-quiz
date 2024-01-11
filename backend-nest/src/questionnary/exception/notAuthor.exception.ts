import { HttpException, HttpStatus } from '@nestjs/common';

export class NotAuthorException extends HttpException {
  constructor() {
    super('You are not the author of this questionnary', HttpStatus.FORBIDDEN);
  }
}
