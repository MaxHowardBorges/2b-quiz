import { HttpException, HttpStatus } from '@nestjs/common';

export class NotAuthorTagException extends HttpException {
  constructor() {
    super('You are not the author of this tag', HttpStatus.FORBIDDEN);
  }
}
