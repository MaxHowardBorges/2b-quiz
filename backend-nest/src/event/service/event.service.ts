import { Injectable } from '@nestjs/common';
import { EventEnum } from '../enum/event.enum';
import { Subject } from 'rxjs';

@Injectable()
export class EventService {
  constructor() {}

  private clientGroups: Map<string, Set<Subject<string>>> = new Map<
    string,
    Set<Subject<string>>
  >();

  sendEvent(event: EventEnum, clientGroup: string): void {
    console.log(this.clientGroups);
    console.log(this.clientGroups.get(clientGroup));
    console.log(clientGroup);
    this.clientGroups.get(clientGroup).forEach((client) => client.next(event));
  }

  createClient(clientGroup: string): Subject<string> {
    const client = new Subject<string>();
    if (!this.clientGroups.get(clientGroup)) {
      this.clientGroups.set(clientGroup, new Set<Subject<string>>());
    }
    this.clientGroups.get(clientGroup).add(client);
    return client;
  }

  removeClient(clientGroup: string, client: Subject<string>): void {
    if (this.clientGroups.get(clientGroup)) {
      this.clientGroups.get(clientGroup).delete(client);
    }
  }

  createClientGroup(clientGroup: string) {
    this.clientGroups.set(clientGroup, new Set<Subject<string>>());
  }
  closeClientGroup(clientGroup: string) {
    this.clientGroups.delete(clientGroup);
  }
}
