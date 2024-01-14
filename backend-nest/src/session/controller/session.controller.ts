import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  ValidationPipe,
} from '@nestjs/common';
import { Session } from '../session';
import { JoinSessionDto } from '../dto/joinSession.dto';
import { CurrentQuestionDto } from '../dto/currentQuestion.dto';
import { SessionService } from '../service/session.service';
import { SessionMapper } from '../mapper/session.mapper';
import { Roles } from '../../decorators/roles.decorator';
import { UserType } from '../../user/constants/userType.constant';
import { UserRequest } from '../../auth/config/user.request';
import { IsNotHostException } from '../exception/isNotHost.exception';
import { IsHostException } from '../exception/isHost.exception';
import { RespondQuestionDto } from '../dto/respondQuestion.dto';
import { GetCurrentQuestionDto } from '../dto/getCurrentQuestion.dto';
import { NextQuestionDto } from '../dto/nextQuestion.dto';
import { WhitelistDto } from '../dto/whitelist.dto';
import { Teacher } from '../../user/entity/teacher.entity';
import { IsNotParticipantException } from '../exception/isNotParticipant.exception';
import { NextQuestionReturnDto } from '../dto/nextQuestionReturn.dto';
import { SettingsDto } from '../dto/settings.dto';
import { IdSessionNoneException } from '../exception/idSessionNone.exception';

@Controller('session')
export class SessionController {
  constructor(
    private sessionService: SessionService,
    private readonly sessionMapper: SessionMapper,
  ) {}

  @Roles([UserType.TEACHER])
  @Post('/create')
  async createSession(
    @Req() request: UserRequest,
    @Body(new ValidationPipe()) ids: number[],
  ): Promise<Session> {
    return this.sessionService.initializeSession(request.user as Teacher, ids);
  }

  @Roles([UserType.TEACHER])
  @Post('/nextQuestion') //TODO replace with /:idSession/
  async nextQuestion(
    @Req() request: UserRequest,
    @Body(new ValidationPipe()) body: NextQuestionDto,
  ): Promise<NextQuestionReturnDto> {
    if (!this.sessionService.isHost(body.idSession, request.user as Teacher))
      throw new IsNotHostException();
    const isEnded = !(await this.sessionService.nextQuestion(body.idSession));
    return { isEnded };
  }

  @Roles([UserType.STUDENT, UserType.TEACHER])
  @Post('/join') //TODO replace with /:idSession/
  @HttpCode(HttpStatus.NO_CONTENT)
  joinSession(
    @Req() request: UserRequest,
    @Body(new ValidationPipe()) body: JoinSessionDto,
  ) {
    if (
      request.user instanceof Teacher &&
      this.sessionService.isHost(body.idSession, request.user)
    )
      throw new IsHostException();
    this.sessionService.join(body.idSession, request.user);
  }

  @Roles([UserType.STUDENT, UserType.TEACHER])
  @Post('/question/current') //TODO go to get & replace with /:idSession/
  async getCurrentQuestion(
    @Req() request: UserRequest,
    @Body(new ValidationPipe()) body: GetCurrentQuestionDto,
  ): Promise<CurrentQuestionDto> {
    if (
      !(
        this.sessionService.isParticipant(body.idSession, request.user) ||
        this.sessionService.isHost(body.idSession, request.user as Teacher)
      )
    )
      throw new IsNotParticipantException();
    const question = await this.sessionService.currentQuestion(body.idSession);
    return this.sessionMapper.mapCurrentQuestionDto(question);
  }

  @Roles([UserType.STUDENT, UserType.TEACHER])
  @Post('/respond') //TODO replace with /:idSession/
  @HttpCode(HttpStatus.NO_CONTENT)
  async respondQuestion(
    @Req() request: UserRequest,
    @Body(new ValidationPipe())
    body: RespondQuestionDto,
  ) {
    await this.sessionService.saveAnswer(
      body.idSession,
      body.answer,
      request.user,
    );
  }

  @Roles([UserType.TEACHER])
  @Get('/getMap') //TODO replace with /:idSession/
  async getMap(
    @Req() request: UserRequest,
    @Query('idsession') idSession: string,
  ) {
    if (!this.sessionService.isHost(idSession, request.user as Teacher))
      throw new IsNotHostException();
    const a = this.sessionService.getMapUser(idSession); //TODO refactor
    this.sessionService.getMap();
    return [
      await this.sessionService.getQuestionList(idSession),
      this.sessionMapper.mapUserAnswerDto(a),
    ]; //TODO replace with a DTO
  }

  @Roles([UserType.TEACHER])
  @Get('/getMap2')
  async getMap2() {
    return this.sessionService.getMap();
  }

  @Roles([UserType.TEACHER])
  @Post('/:idSession/settings')
  async setSessionSettings(
    @Req() request: UserRequest,
    @Param('idSession') idSession: string,
    @Body(new ValidationPipe()) settings: SettingsDto,
  ) {
    if (!this.sessionService.isSessionExists(idSession))
      throw new IdSessionNoneException();
    if (!this.sessionService.isHost(idSession, request.user as Teacher))
      throw new IsNotHostException();
    this.sessionService.setSettings(idSession, settings);
  }

  @Roles([UserType.TEACHER])
  @Post('/:idSession/whitelist/add')
  async addWhitelist(
    @Req() request: UserRequest,
    @Param('idSession') idSession: string,
    @Body(new ValidationPipe()) body: WhitelistDto,
  ) {
    if (!this.sessionService.isSessionExists(idSession))
      throw new IdSessionNoneException();
    if (!this.sessionService.isHost(idSession, request.user as Teacher))
      throw new IsNotHostException();
    this.sessionService.addToWhitelist(idSession, body.whitelist);
  }
}
