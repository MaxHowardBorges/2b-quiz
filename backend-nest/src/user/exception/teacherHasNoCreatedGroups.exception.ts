import { HttpException, HttpStatus } from '@nestjs/common';

export class TeacherHasNoCreatedGroupsException extends HttpException {
  constructor() {
    //TODO chercher si un autre code erreur n'est pas plus adapté
    super('Teacher has no created groups', HttpStatus.BAD_REQUEST);
  }
}
