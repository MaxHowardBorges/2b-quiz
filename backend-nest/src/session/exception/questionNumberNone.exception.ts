import { HttpException, HttpStatus } from '@nestjs/common';

export class QuestionNumberNoneException extends HttpException {
  constructor() {
    super('QuestionNumber none', HttpStatus.BAD_REQUEST);
  }
}
