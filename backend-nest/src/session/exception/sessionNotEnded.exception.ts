import { HttpException, HttpStatus } from '@nestjs/common';

export class SessionNotEndedException extends HttpException {
  constructor() {
    super('Session not ended', HttpStatus.FORBIDDEN);
  }
}
