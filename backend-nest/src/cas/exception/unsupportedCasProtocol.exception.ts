export class UnsupportedCasProtocolException extends Error {
  constructor() {
    super('unsupported cas protocol exception');
    Object.setPrototypeOf(this, UnsupportedCasProtocolException.prototype);
  }
}
