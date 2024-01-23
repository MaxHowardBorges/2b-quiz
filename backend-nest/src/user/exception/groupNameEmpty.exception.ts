import { HttpException, HttpStatus } from '@nestjs/common';

export class GroupNameEmptyException extends HttpException {
  constructor() {
    super('Group name cannot be empty', HttpStatus.BAD_REQUEST);
  }
}
