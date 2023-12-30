import { HttpException, HttpStatus } from '@nestjs/common';

export class UsernamesDuplicatedUsedException extends HttpException {
  constructor(usedUsernames: string[]) {
    super(
      'duplicate username error:' + usedUsernames.toString(),
      HttpStatus.BAD_REQUEST,
    );
  }
}
