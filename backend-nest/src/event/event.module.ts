import { Module } from '@nestjs/common';
import { EventGateway } from './gateway/event.gateway';
import { EventService } from './service/event.service';

@Module({
  providers: [EventGateway, EventService],
  exports: [EventService],
})
export class EventModule {}
