import { Controller, Get, Param } from '@nestjs/common';
import { EventService } from '../service/event.service';
import { EventEnum } from '../enum/event.enum';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get('/next-question/:idSession')
  getCurrentQuestion(@Param('idSession') idSession: string): void {
    this.eventService.sendEvent(EventEnum.NEXT_QUESTION, idSession);
  }
}
