import { Injectable } from '@nestjs/common';
import { EventEnum } from '../enum/event.enum';
import { Subject } from 'rxjs';
import { SessionNotFoundException } from '../exception/sessionNotFound.exception';

@Injectable()
export class EventService {
  constructor() {}

  private studentSessionMap: Map<string, Set<Subject<string>>> = new Map<
    string,
    Set<Subject<string>>
  >();

  private observerSessionMap: Map<string, Subject<string>> = new Map<
    string,
    Subject<string>
  >();

  private hostSessionMap: Map<string, Subject<string>> = new Map<
    string,
    Subject<string>
  >();

  sendEvent(event: EventEnum, idSession: string): void {
    this.studentSessionMap
      .get(idSession)
      .forEach((client) => client.next(event));
    this.observerSessionMap.get(idSession).next(event);
    this.hostSessionMap.get(idSession).next(event);
  }

  createClient(idSession: string): Subject<string> {
    const client = new Subject<string>();
    if (!this.studentSessionMap.get(idSession)) {
      this.studentSessionMap.set(idSession, new Set<Subject<string>>());
    }
    this.studentSessionMap.get(idSession).add(client);
    return client;
  }

  removeClient(idSession: string, client: Subject<string>): void {
    if (this.studentSessionMap.get(idSession)) {
      this.studentSessionMap.get(idSession).delete(client);
    }
  }

  createObserver(idSession: string): Subject<string> {
    const observer = new Subject<string>();
    if (!this.observerSessionMap.get(idSession))
      throw new SessionNotFoundException();
    this.observerSessionMap.set(idSession, observer);
    return observer;
  }

  removeObserver(idSession: string): void {
    if (this.observerSessionMap.get(idSession)) {
      this.observerSessionMap.set(idSession, new Subject<string>());
    }
  }

  createHost(idSession: string): Subject<string> {
    const host = new Subject<string>();
    if (!this.hostSessionMap.get(idSession))
      throw new SessionNotFoundException();
    this.hostSessionMap.set(idSession, host);
    return host;
  }

  removeHost(idSession: string): void {
    if (this.hostSessionMap.get(idSession)) {
      this.hostSessionMap.set(idSession, new Subject<string>());
    }
  }

  createSessionGroup(idSession: string) {
    this.studentSessionMap.set(idSession, new Set<Subject<string>>());
    this.observerSessionMap.set(idSession, new Subject<string>());
    this.hostSessionMap.set(idSession, new Subject<string>());
  }
  closeSessionGroup(idSession: string) {
    this.studentSessionMap.delete(idSession);
    this.observerSessionMap.delete(idSession);
    this.hostSessionMap.delete(idSession);
  }
}
