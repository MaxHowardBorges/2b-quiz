import { HttpException, HttpStatus } from '@nestjs/common';

export class UsernamesAlreadyUsedException extends HttpException {
  constructor(usedUsernames: string[]) {
    super(usedUsernames, HttpStatus.BAD_REQUEST);
  }
}
