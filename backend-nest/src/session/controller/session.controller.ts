import { Question } from '../../question/entity/question.entity';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { Session } from '../session';
import { CurrentQuestionDto } from '../dto/currentQuestion.dto';
import { SessionService } from '../service/session.service';
import { SessionMapper } from '../mapper/session.mapper';
import { BodyEmptyException } from '../exception/bodyEmpty.exception';
import { Roles } from '../../decorators/roles.decorator';
import { UserType } from '../../user/constants/userType.constant';
import { UserRequest } from '../../auth/config/user.request';
import { IsNotHostException } from '../exception/isNotHost.exception';
import { IsHostException } from '../exception/isHost.exception';

@Controller('session')
export class SessionController {
  constructor(
    private sessionService: SessionService,
    private readonly sessionMapper: SessionMapper,
  ) {}

  @Roles([UserType.TEACHER])
  @Post('/create')
  async createSession(request: UserRequest): Promise<Session> {
    return this.sessionService.initializeSession(request.user);
  }

  @Roles([UserType.TEACHER])
  @Post('/nextQuestion')
  nextQuestion(
    @Req() request: UserRequest,
    @Body() body: { id: string },
  ): Question | NonNullable<unknown> {
    if (body.id == undefined) {
      throw new BodyEmptyException();
    }
    if (!this.sessionService.isHost(body.id, request.user))
      throw new IsNotHostException();
    const question = this.sessionService.nextQuestion(body.id);
    if (question) {
      return question;
    }
    return {};
  }

  @Roles([UserType.STUDENT, UserType.TEACHER])
  @Post('/join')
  @HttpCode(HttpStatus.NO_CONTENT)
  joinSession(
    @Req() request: UserRequest,
    @Body() body: { idSession: string; username: string },
  ) {
    if (body.idSession == undefined || body.username == undefined) {
      throw new BodyEmptyException();
    }
    if (this.sessionService.isHost(body.idSession, request.user))
      throw new IsHostException();
    this.sessionService.join(body.idSession, request.user);
  }

  @Roles([UserType.STUDENT, UserType.TEACHER])
  @Post('/question/current') //TODO go to get
  getCurrentQuestion(
    @Req() request: UserRequest,
    @Body() body: { idSession: string },
  ): CurrentQuestionDto {
    if (body.idSession == undefined) {
      throw new BodyEmptyException();
    }
    if (this.sessionService.isHost(body.idSession, request.user))
      throw new IsHostException();
    const question = this.sessionService.currentQuestion(body.idSession);
    return this.sessionMapper.mapCurrentQuestionDto(question);
  }

  @Roles([UserType.STUDENT])
  @Post('/respond')
  @HttpCode(HttpStatus.NO_CONTENT)
  async respondQuestion(
    @Req() request: UserRequest,
    @Body() body: { idSession: string; answer: number; username: string },
  ) {
    if (
      body.idSession == undefined ||
      body.answer == undefined ||
      body.username == undefined
    ) {
      throw new BodyEmptyException();
    }
    await this.sessionService.saveAnswer(
      body.idSession,
      body.answer,
      request.user,
    );
  }

  @Roles([UserType.TEACHER])
  @Get('/getMap') //?idsession={l'id du session}
  async getMap(
    @Req() request: UserRequest,
    @Query('idsession') idSession: string,
  ) {
    if (!this.sessionService.isHost(idSession, request.user))
      throw new IsNotHostException();
    const a = this.sessionService.getMapUser(idSession); //TODO refactor
    this.sessionService.getMap();
    return [
      this.sessionService.getQuestionList(idSession),
      this.sessionMapper.mapUserAnswerDto(a),
    ];
  }
}
