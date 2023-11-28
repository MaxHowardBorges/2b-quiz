import { HttpException, HttpStatus } from '@nestjs/common';

export class BodyEmptyException extends HttpException {
  constructor() {
    super('Body is empty', HttpStatus.BAD_REQUEST);
  }
}
