import { HttpException, HttpStatus } from '@nestjs/common';

export class IsNotParticipantException extends HttpException {
  constructor() {
    super('User is not participant', HttpStatus.UNAUTHORIZED);
  }
}
