import { HttpException, HttpStatus } from '@nestjs/common';

export class UserNotInWhitelistException extends HttpException {
  constructor() {
    super(
      "This username does not appear on the session's whitelist",
      HttpStatus.METHOD_NOT_ALLOWED,
    );
  }
}
