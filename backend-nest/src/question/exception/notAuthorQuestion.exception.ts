import { HttpException, HttpStatus } from '@nestjs/common';

export class NotAuthorQuestionException extends HttpException {
  constructor() {
    super('You are not the author of this question', HttpStatus.FORBIDDEN);
  }
}
