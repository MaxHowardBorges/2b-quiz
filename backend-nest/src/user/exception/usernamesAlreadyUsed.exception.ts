import { HttpException, HttpStatus } from '@nestjs/common';

export class UsernamesAlreadyUsedException extends HttpException {
  constructor(usedUsernames: string[]) {
    super(usedUsernames.toString(), HttpStatus.BAD_REQUEST);
  }
}
