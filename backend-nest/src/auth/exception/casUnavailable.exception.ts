import { HttpException, HttpStatus } from '@nestjs/common';

export class CasUnavailableException extends HttpException {
  constructor() {
    super('cas unavailable', HttpStatus.SERVICE_UNAVAILABLE);
  }
}
