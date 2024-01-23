import { HttpException, HttpStatus } from '@nestjs/common';

export class DontOwnTheGroup extends HttpException {
  constructor() {
    //TODO chercher si un autre code erreur n'est pas plus adapté
    super(
      "This group don't belong to you. Only the owner can modify it",
      HttpStatus.BAD_REQUEST,
    );
  }
}
