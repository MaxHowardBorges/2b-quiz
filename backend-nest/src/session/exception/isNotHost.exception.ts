import { HttpException, HttpStatus } from '@nestjs/common';

export class IsNotHostException extends HttpException {
  constructor() {
    super('You are not the host of this session', HttpStatus.FORBIDDEN);
  }
}
