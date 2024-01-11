import { Subject } from 'rxjs';

export class ParticipantEventListenerObject {
  protected subject: Subject<string>;
  private readonly id: number;

  constructor(id: number) {
    this.subject = new Subject<string>();
    this.id = id;
  }

  getSubject(): Subject<string> {
    return this.subject;
  }

  checkId(id: number): boolean {
    return this.id === id;
  }

  resetSubject(): void {
    this.subject = new Subject<string>();
  }

  equals(studentEventListenerObject: ParticipantEventListenerObject): boolean {
    return this.id === studentEventListenerObject.id;
  }
}
