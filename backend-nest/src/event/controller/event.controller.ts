import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { EventService } from '../service/event.service';
import { EventEnum } from '../enum/event.enum';
import { Response } from 'express';
import { Headerless } from '../../decorators/headerless.decorator';
import { Roles } from '../../decorators/roles.decorator';
import { UserType } from '../../user/constants/userType.constant';
import { Request } from 'express';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get('/next-question/:idSession')
  getCurrentQuestion(@Param('idSession') idSession: string): void {
    this.eventService.sendEvent(EventEnum.NEXT_QUESTION, idSession);
  }

  @Roles([UserType.STUDENT, UserType.TEACHER])
  @Headerless()
  @Get(':idSession/student')
  async sse(
    @Req() req: Request,
    @Res() res: Response,
    @Param('idSession') idSession: string,
  ) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const client = this.eventService.createClient(idSession);

    req.on('close', () => {
      this.eventService.removeClient(idSession, client);
    });

    client.subscribe((data) => {
      res.write(`data: ${data}\n\n`);
    });
  }

  @Roles([UserType.TEACHER])
  @Headerless()
  @Get(':idSession/observer')
  async sseObserver(
    @Req() req: Request,
    @Res() res: Response,
    @Param('idSession') idSession: string,
  ) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const client = this.eventService.createObserver(idSession);

    req.on('close', () => {
      this.eventService.removeObserver(idSession);
    });

    client.subscribe((data) => {
      res.write(`data: ${data}\n\n`);
    });
  }

  @Roles([UserType.TEACHER])
  @Headerless()
  @Get(':idSession/host')
  async sseHost(
    @Req() req: Request,
    @Res() res: Response,
    @Param('idSession') idSession: string,
  ) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const client = this.eventService.createHost(idSession);

    req.on('close', () => {
      this.eventService.removeHost(idSession);
    });

    client.subscribe((data) => {
      res.write(`data: ${data}\n\n`);
    });
  }
}
