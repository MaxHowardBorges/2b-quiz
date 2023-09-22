import { Injectable } from '@nestjs/common';
import { EventGateway } from '../gateway/event.gateway';
import { EventEnum } from '../enum/event.enum';

@Injectable()
export class EventService {
  constructor(private readonly eventGateway: EventGateway) {}

  sendEvent(event: EventEnum, clientGroup: string) {
    //TODO rename group
    this.eventGateway.sendMessage(clientGroup, event);
  }
}
