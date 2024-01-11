import { HttpException, HttpStatus } from '@nestjs/common';

export class QuestionnaryNotFoundException extends HttpException {
  constructor() {
    super('Questionnary not found', HttpStatus.NOT_FOUND);
  }
}
