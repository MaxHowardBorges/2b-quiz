import { HttpException, HttpStatus } from '@nestjs/common';

export class UsernamesAlreadyUsedException extends HttpException {
  constructor(usedUsernames: string[]) {
    super(
      'used username error:' + usedUsernames.toString(),
      HttpStatus.BAD_REQUEST,
    );
  }
}
