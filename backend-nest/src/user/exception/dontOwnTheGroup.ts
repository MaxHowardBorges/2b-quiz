import { HttpException, HttpStatus } from '@nestjs/common';

export class DontOwnTheGroup extends HttpException {
  constructor() {
    super(
      "This group don't belong to you. Only the owner can modify it",
      HttpStatus.BAD_REQUEST,
    );
  }
}
