import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { QuestionnaryService } from '../service/questionnary.service';
import { QuestionnaryCreateDto } from '../dto/questionnaryCreate.dto';
import { QuestionCreateDto } from '../../question/dto/questionCreate.dto';
import { QuestionService } from '../../question/service/question.service';
import { TagDto } from '../../question/dto/tag.dto';
import { Req } from '@nestjs/common/decorators/http/route-params.decorator';
import { UserRequest } from '../../auth/config/user.request';
import { UserType } from '../../user/constants/userType.constant';
import { Roles } from '../../decorators/roles.decorator';
import { Teacher } from '../../user/entity/teacher.entity';
import { NotAuthorException } from '../exception/notAuthor.exception';
import { QuestionnaryNotFoundException } from '../exception/questionnaryNotFound.exception';

@Controller('questionnary')
export class QuestionnaryController {
  constructor(
    private readonly questionnaryService: QuestionnaryService,
    private readonly questionService: QuestionService,
  ) {}
  @Post('/tag')
  createTag(@Body(new ValidationPipe()) tagDto: TagDto) {
    return this.questionService.createTag(tagDto);
  }

  @Patch('/tag/:id')
  updateTag(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) newTag: TagDto,
  ) {
    return this.questionService.updateTag(id, newTag);
  }

  @Delete('/tag/:id')
  deleteTag(@Param('id', ParseIntPipe) id: number) {
    return this.questionService.deleteTag(id);
  }

  @Get('/tag/:id')
  getTag(@Param('id', ParseIntPipe) id: number) {
    return this.questionService.getTag(id);
  }

  @Get('/tag/user/:id')
  getTags(@Param('id', ParseIntPipe) id: number) {
    return this.questionService.getTags(id);
  }

  @Roles([UserType.TEACHER])
  @Post('/create')
  createQuestionnary(
    @Req() request: UserRequest,
    @Body(new ValidationPipe()) questionnaryDto: QuestionnaryCreateDto,
  ) {
    return this.questionnaryService.createQuestionnary(
      questionnaryDto,
      <Teacher>request.user,
    );
  }

  @Roles([UserType.TEACHER])
  @Delete('/:id')
  async deleteQuestionnary(
    @Req() request: UserRequest,
    @Param('id', ParseIntPipe) idQuestionnary: number,
  ) {
    if (!(await this.questionnaryService.questionnaryExists(idQuestionnary)))
      throw new QuestionnaryNotFoundException();
    if (
      !(await this.questionnaryService.isQuestionnaryFromTeacher(
        idQuestionnary,
        request.user as Teacher,
      ))
    )
      throw new NotAuthorException();
    return this.questionnaryService.deleteQuestionnary(idQuestionnary);
  }

  @Get('/:id')
  async selectQuestionnary(@Param('id', ParseIntPipe) idQuestionnary: number) {
    if (!(await this.questionnaryService.questionnaryExists(idQuestionnary)))
      throw new QuestionnaryNotFoundException();
    return this.questionnaryService.findQuestionnary(idQuestionnary);
  }

  @Roles([UserType.TEACHER])
  @Get()
  selectQuestionnaryList(@Req() request: UserRequest) {
    return this.questionnaryService.findQuestionnariesFromIdUser(
      request.user as Teacher,
    );
  }

  @Get('/:id/question/')
  async selectQuestionsFromQuestionnary(
    @Param('id', ParseIntPipe) idQuestionnary: number,
  ) {
    if (!(await this.questionnaryService.questionnaryExists(idQuestionnary)))
      throw new QuestionnaryNotFoundException();
    return this.questionnaryService.findQuestionsFromIdQuestionnary(
      idQuestionnary,
    );
  }

  @Roles([UserType.TEACHER])
  @Post('/:id/question/')
  async addQuestion(
    @Param('id', ParseIntPipe) idQuestionnary: number,
    @Body(new ValidationPipe()) questionDto: QuestionCreateDto,
    @Req() request: UserRequest,
  ) {
    if (!(await this.questionnaryService.questionnaryExists(idQuestionnary)))
      throw new QuestionnaryNotFoundException();
    if (
      !(await this.questionnaryService.isQuestionnaryFromTeacher(
        idQuestionnary,
        request.user as Teacher,
      ))
    )
      throw new NotAuthorException();
    return this.questionnaryService.addQuestion(idQuestionnary, questionDto);
  }

  @Get('/user/:idUser/questions')
  async getQuestionsPrivateBank(@Param('idUser', ParseIntPipe) idUser: number) {
    return await this.questionService.getQuestionPrivateBank(idUser);
  }

  @Roles([UserType.TEACHER])
  @Delete('/:id/question/:idQuestion')
  async deleteQuestion(
    @Param('id', ParseIntPipe) idQuestionnary: number,
    @Param('idQuestion', ParseIntPipe) idQuestion: number,
    @Req() request: UserRequest,
  ) {
    if (!(await this.questionnaryService.questionnaryExists(idQuestionnary)))
      throw new QuestionnaryNotFoundException();
    if (
      !(await this.questionnaryService.isQuestionnaryFromTeacher(
        idQuestionnary,
        request.user as Teacher,
      ))
    )
      throw new NotAuthorException();
    return this.questionnaryService.deleteQuestion(idQuestionnary, idQuestion);
  }

  @Roles([UserType.TEACHER])
  @Patch('/:id/question/:idQuestion')
  async modifyQuestion(
    @Param('id', ParseIntPipe) idQuestionnary: number,
    @Param('idQuestion', ParseIntPipe) idQuestion: number,
    @Body(new ValidationPipe()) questionDto: QuestionCreateDto,
    @Req() request: UserRequest,
  ) {
    if (!(await this.questionnaryService.questionnaryExists(idQuestionnary)))
      throw new QuestionnaryNotFoundException();
    if (
      !(await this.questionnaryService.isQuestionnaryFromTeacher(
        idQuestionnary,
        request.user as Teacher,
      ))
    )
      throw new NotAuthorException();
    return this.questionnaryService.modifyQuestion(
      idQuestionnary,
      idQuestion,
      questionDto,
    );
  }

  @Roles([UserType.TEACHER])
  @Patch('/:id')
  async modifyQuestionnary(
    @Param('id', ParseIntPipe) idQuestionnary: number,
    @Body() body: { questionnaryName: string },
    @Req() request: UserRequest,
  ) {
    if (!(await this.questionnaryService.questionnaryExists(idQuestionnary)))
      throw new QuestionnaryNotFoundException();
    if (
      !(await this.questionnaryService.isQuestionnaryFromTeacher(
        idQuestionnary,
        request.user as Teacher,
      ))
    )
      throw new NotAuthorException();
    return this.questionnaryService.modifyQuestionnary(
      idQuestionnary,
      body.questionnaryName,
      request.user as Teacher,
    );
  }
}
