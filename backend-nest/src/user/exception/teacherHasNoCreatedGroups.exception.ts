import { HttpException, HttpStatus } from '@nestjs/common';

export class TeacherHasNoCreatedGroupsException extends HttpException {
  constructor() {
    super('Teacher has no created groups', HttpStatus.BAD_REQUEST);
  }
}
