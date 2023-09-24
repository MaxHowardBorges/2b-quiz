import { HttpException, HttpStatus } from '@nestjs/common';

export class IdSessionNoneException extends HttpException {
  constructor() {
    super('IdSession none', HttpStatus.BAD_REQUEST);
  }
}
