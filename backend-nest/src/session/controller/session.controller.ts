import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
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
import { QuestionnaryMapper } from '../../questionnary/mapper/questionnary.mapper';
import { Roles } from '../../decorators/roles.decorator';
import { UserType } from '../../user/constants/userType.constant';
import { UserRequest } from '../../auth/config/user.request';
import { IsNotHostException } from '../exception/isNotHost.exception';
import { IsHostException } from '../exception/isHost.exception';
import { RespondQuestionDto } from '../dto/respondQuestion.dto';
import { NextQuestionDto } from '../dto/nextQuestion.dto';
import { WhitelistDto } from '../dto/whitelist.dto';
import { Teacher } from '../../user/entity/teacher.entity';
import { IsNotParticipantException } from '../exception/isNotParticipant.exception';
import { NextQuestionReturnDto } from '../dto/nextQuestionReturn.dto';
import { SettingsDto } from '../dto/settings.dto';
import { IdSessionNoneException } from '../exception/idSessionNone.exception';
import { DisplaySettingsDto } from '../dto/displaySettings.dto';
import { SessionStatusDto } from '../dto/sessionStatus.dto';
import { CreateSessionDto } from '../dto/createSession.dto';

@Controller('session')
export class SessionController {
  constructor(
    private sessionService: SessionService,
    private readonly sessionMapper: SessionMapper,
    private readonly questionnaryMapper: QuestionnaryMapper,
  ) {}

  @Roles([UserType.TEACHER])
  @Post('/create')
  async createSession(
    @Req() request: UserRequest,
    @Body(new ValidationPipe()) createSessionDto: CreateSessionDto,
  ): Promise<Session> {
    return this.sessionService.initializeSession(
      request.user as Teacher,
      createSessionDto.questionnaryList,
      createSessionDto.settings,
      createSessionDto.whitelist,
      createSessionDto.whitelistGroups,
      // paramSession.idsQuestionnarys,
      // paramSession.isResult,
      // paramSession.isGlobal,
      // paramSession.isResponses,
    );
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

  @Roles([UserType.TEACHER, UserType.STUDENT])
  @Get('/getSessionsList')
  async getSessionsList(
    @Req() request: UserRequest,
    @Query('idsession') idSession: string,
  ) {
    //Return the results of the session
    return await this.sessionService.getListSession(request.user);
  }
  @Roles([UserType.TEACHER, UserType.STUDENT])
  @Get('/:idSession/result')
  async getResults(
    @Req() request: UserRequest,
    @Param('idSession') idSession: number,
  ) {
    //Return the results of the session
    return await this.sessionService.getResults(idSession, request.user);
  }

  @Roles([UserType.TEACHER, UserType.STUDENT])
  @Get('/endSession')
  async saveSession(
    @Req() request: UserRequest,
    @Query('idsession') idSession: string,
  ) {
    if (!this.sessionService.isHost(idSession, request.user as Teacher))
      throw new IsNotHostException();
    await this.sessionService.saveSession(idSession);
    return HttpStatus.NO_CONTENT;
  }

  @Roles([UserType.TEACHER])
  @Get('/stopSession') //TODO replace with /:idSession/
  async stopSession(
    @Req() request: UserRequest,
    @Query('idsession') idSession: string,
  ) {
    if (!this.sessionService.isHost(idSession, request.user as Teacher))
      throw new IsNotHostException();
    await this.sessionService.deleteQuestionnary(idSession);
    return HttpStatus.NO_CONTENT;
  }

  @Roles([UserType.TEACHER])
  @Get('/getMap2')
  async getMap2() {
    return this.sessionService.getMap();
  }

  @Roles([UserType.STUDENT, UserType.TEACHER])
  @Post('/:idSession/question')
  async getCurrentQuestion(
    @Req() request: UserRequest,
    @Param('idSession') idSession: string,
  ): Promise<CurrentQuestionDto> {
    if (
      !(
        this.sessionService.isParticipant(idSession, request.user) ||
        this.sessionService.isHost(idSession, request.user as Teacher)
      )
    )
      throw new IsNotParticipantException();
    const question = await this.sessionService.currentQuestion(idSession);
    return this.sessionMapper.mapCurrentQuestionDto(question);
  }

  @Roles([UserType.STUDENT, UserType.TEACHER])
  @Post('/:idSession/join')
  joinSession(
    @Req() request: UserRequest,
    @Param('idSession') idSession: string,
  ) {
    if (
      request.user instanceof Teacher &&
      this.sessionService.isHost(idSession, request.user)
    )
      throw new IsHostException();
    this.sessionService.join(idSession, request.user);
    if (this.sessionService.isStarted(idSession)) return { isStarted: true };
    return { isStarted: false };
  }

  @Roles([UserType.TEACHER])
  @Patch('/:idSession/settings')
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

  //TODO add /:idSession/whitelist/addGroup

  @Roles([UserType.TEACHER])
  @Get('/:idSession/display-settings')
  async getDisplaySettings(
    @Req() request: UserRequest,
    @Param('idSession') idSession: string,
  ): Promise<DisplaySettingsDto> {
    if (!this.sessionService.isSessionExists(idSession))
      throw new IdSessionNoneException();
    if (!this.sessionService.isHost(idSession, request.user as Teacher))
      throw new IsNotHostException();
    return this.sessionService.getDisplaySettings(idSession);
  }

  @Roles([UserType.TEACHER])
  @Get('/:idSession/status')
  async getSessionStatus(
    @Req() request: UserRequest,
    @Param('idSession') idSession: string,
  ): Promise<SessionStatusDto> {
    if (!this.sessionService.isSessionExists(idSession))
      throw new IdSessionNoneException();
    if (!this.sessionService.isHost(idSession, request.user as Teacher))
      throw new IsNotHostException();
    return this.sessionMapper.mapSessionStatusDto(
      this.sessionService.getSessionStatus(idSession),
    );
  }
}
