import { HttpException, HttpStatus } from '@nestjs/common';

export class AdminCantJoinException extends HttpException {
  constructor() {
    super("An admin can't join", HttpStatus.FORBIDDEN);
  }
}
