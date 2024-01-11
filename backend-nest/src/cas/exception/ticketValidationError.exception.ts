export class TicketValidationErrorException extends Error {
  constructor() {
    super('ticket validation error');
    Object.setPrototypeOf(this, TicketValidationErrorException.prototype);
    this.name = 'TicketValidationErrorException';
  }
}
