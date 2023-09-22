import { HttpException, HttpStatus } from '@nestjs/common';

export class AnswersNoneException extends HttpException {
  constructor() {
    super('Answers none', HttpStatus.BAD_REQUEST);
  }
}
