import { HttpException, HttpStatus } from '@nestjs/common';

export class StudentNotInGroupException extends HttpException {
  constructor() {
    super(
      'The user you are trying to remove is not in this group',
      HttpStatus.BAD_REQUEST,
    );
  }
}
