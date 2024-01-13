import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { EventService } from '../service/event.service';
import { EventEnum } from '../enum/event.enum';
import { Response } from 'express';
import { Headerless } from '../../decorators/headerless.decorator';
import { Roles } from '../../decorators/roles.decorator';
import { UserType } from '../../user/constants/userType.constant';
import { UserRequest } from '../../auth/config/user.request';

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
    @Req() req: UserRequest,
    @Res() res: Response,
    @Param('idSession') idSession: string,
  ) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    const idUser = req.user.id;
    const client = await this.eventService.createClient(idSession, idUser);

    req.on('close', () => {
      try {
        this.eventService.removeClient(idSession, idUser);
      } catch (e) {}
    });

    client.subscribe((data) => {
      res.write(`data: ${data}\n\n`);
    });
  }

  @Roles([UserType.TEACHER])
  @Headerless()
  @Get(':idSession/observer')
  async sseObserver(
    @Req() req: UserRequest,
    @Res() res: Response,
    @Param('idSession') idSession: string,
  ) {
    console.log('observer', idSession, req.user.id);
    const client = await this.eventService.createObserver(
      idSession,
      req.user.id,
    );

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    req.on('close', () => {
      this.eventService.removeObserver(idSession, req.user.id);
    });

    client.subscribe((data) => {
      res.write(`data: ${data}\n\n`);
    });
  }

  @Roles([UserType.TEACHER])
  @Headerless()
  @Get(':idSession/host')
  async sseHost(
    @Req() req: UserRequest,
    @Res() res: Response,
    @Param('idSession') idSession: string,
  ) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const client = await this.eventService.createHost(idSession, req.user.id);

    req.on('close', () => {
      this.eventService.removeHost(idSession, req.user.id);
    });

    client.subscribe((data) => {
      res.write(`data: ${data}\n\n`);
    });
  }
}
