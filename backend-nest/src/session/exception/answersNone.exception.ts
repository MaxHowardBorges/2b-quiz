import { HttpException, HttpStatus } from '@nestjs/common';

export class AnswersNoneException extends HttpException {
  constructor() {
    super('Answers does not exists in this question', HttpStatus.BAD_REQUEST);
  }
}
