import { HttpException } from '@nestjs/common';

export class StudentCantCreateGroupsException extends HttpException {
  constructor() {
    super('Student can not create group', 401);
  }
}
