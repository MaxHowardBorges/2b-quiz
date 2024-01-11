import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidTicketException extends HttpException {
  constructor() {
    super('invalid ticket', HttpStatus.FORBIDDEN);
  }
}
