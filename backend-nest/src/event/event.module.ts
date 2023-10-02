import { Module } from '@nestjs/common';
import { EventGateway } from './gateway/event.gateway';
import { EventService } from './service/event.service';
import { EventController } from './controller/event.controller';

@Module({
  providers: [EventGateway, EventService],
  exports: [EventService],
  controllers: [EventController],
})
export class EventModule {}
