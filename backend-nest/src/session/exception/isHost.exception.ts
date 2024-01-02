import { HttpException, HttpStatus } from '@nestjs/common';

export class IsHostException extends HttpException {
  constructor() {
    super('You are the host of this session', HttpStatus.FORBIDDEN);
  }
}
