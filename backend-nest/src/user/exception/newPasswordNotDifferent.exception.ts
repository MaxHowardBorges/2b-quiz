import { HttpException, HttpStatus } from '@nestjs/common';

export class NewPasswordNotDifferent extends HttpException {
  constructor() {
    super('new password not different from precedent', HttpStatus.FORBIDDEN);
  }
}
