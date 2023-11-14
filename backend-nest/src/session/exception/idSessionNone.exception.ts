import { HttpException, HttpStatus } from '@nestjs/common';

export class IdSessionNoneException extends HttpException {
  constructor() {
    super('IdSession not exists', HttpStatus.BAD_REQUEST);
  }
}
