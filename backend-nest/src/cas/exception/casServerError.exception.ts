export class CasServerErrorException extends Error {
  constructor() {
    super('cas server error exception');
    Object.setPrototypeOf(this, CasServerErrorException.prototype);
  }
}
