import { HttpException, HttpStatus } from '@nestjs/common';

export class AnswerNotOfCurrentQuestionException extends HttpException {
  constructor() {
    super('Answer not of current question', HttpStatus.FORBIDDEN);
  }
}
