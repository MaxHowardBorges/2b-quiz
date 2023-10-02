import { HttpException, HttpStatus } from '@nestjs/common';

export class QuestionNoneException extends HttpException {
  constructor() {
    super('Question none', HttpStatus.BAD_REQUEST);
  }
}
