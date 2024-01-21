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
import { SessionTemp } from '../temp/sessionTemp';
import { JoinSessionDto } from '../dto/joinSession.dto';
import { CurrentQuestionDto } from '../dto/currentQuestion.dto';
import { SessionService } from '../service/session.service';
import { SessionMapper } from '../mapper/session.mapper';
import { QuestionnaryMapper } from '../../questionnary/mapper/questionnary.mapper';
import { QuestionMapper } from '../../question/mapper/question.mapper';
import { Roles } from '../../decorators/roles.decorator';
import { UserType } from '../../user/constants/userType.constant';
import { UserRequest } from '../../auth/config/user.request';
import { IsNotHostException } from '../exception/isNotHost.exception';
import { IsHostException } from '../exception/isHost.exception';
import { RespondQuestionDto } from '../dto/respondQuestion.dto';
import { GetCurrentQuestionDto } from '../dto/getCurrentQuestion.dto';
import { NextQuestionDto } from '../dto/nextQuestion.dto';
import { Teacher } from '../../user/entity/teacher.entity';
import { CreateSessionDto } from '../dto/createSession.dto';
import { Student } from '../../user/entity/student.entity';

@Controller('session')
export class SessionController {
  constructor(
    private sessionService: SessionService,
    private readonly sessionMapper: SessionMapper,
    private readonly questionnaryMapper: QuestionnaryMapper,
    private readonly questionMapper: QuestionMapper,
  ) {}

  @Roles([UserType.TEACHER])
  @Post('/create')
  async createSession(
    @Req() request: UserRequest,
    @Body(new ValidationPipe()) paramSession: CreateSessionDto,
  ) {
    const test = this.sessionMapper.mapSessionTempDto(
      await this.sessionService.initializeSession(
        request.user as Teacher,
        paramSession.idsQuestionnarys,
        paramSession.isResult,
        paramSession.isGlobal,
        paramSession.isResponses,
      ),
    );
    return test;
  }

  @Roles([UserType.TEACHER])
  @Post('/nextQuestion')
  async nextQuestion(
    @Req() request: UserRequest,
    @Body(new ValidationPipe()) body: NextQuestionDto,
  ) {
    if (!this.sessionService.isHost(body.idSession, request.user as Teacher))
      throw new IsNotHostException();
    const question = await this.sessionService.nextQuestion(body.idSession);
    if (question) {
      return this.questionMapper.entityToQuestionDto(question);
    }
    return null;
  }

  @Roles([UserType.STUDENT, UserType.TEACHER])
  @Post('/join')
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
  @Post('/question/current') //TODO go to get
  async getCurrentQuestion(
    @Req() request: UserRequest,
    @Body(new ValidationPipe()) body: GetCurrentQuestionDto,
  ): Promise<CurrentQuestionDto> {
    if (
      request.user instanceof Teacher &&
      this.sessionService.isHost(body.idSession, request.user)
    )
      throw new IsHostException();
    const question = this.questionMapper.entityToQuestionDto(
      await this.sessionService.currentQuestion(body.idSession),
    );
    return this.sessionMapper.mapCurrentQuestionDto(question);
  }

  @Roles([UserType.STUDENT, UserType.TEACHER])
  @Post('/respond')
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
    //TODO IMPLEMENTS
    await this.sessionService.saveSession(idSession, this.sessionMapper);
    return HttpStatus.NO_CONTENT;
  }

  @Roles([UserType.TEACHER])
  @Get('/stopSession')
  async stopSession(
    @Req() request: UserRequest,
    @Query('idsession') idSession: string,
  ) {
    if (!this.sessionService.isHost(idSession, request.user as Teacher))
      throw new IsNotHostException();
    //TODO IMPLEMENTS
    await this.sessionService.deleteQuestionnary(idSession);
    return HttpStatus.NO_CONTENT;
  }
}
