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
import { QuestionService } from '../service/question.service';
import { Roles } from '../../decorators/roles.decorator';
import { UserType } from '../../user/constants/userType.constant';
import { Req } from '@nestjs/common/decorators/http/route-params.decorator';
import { UserRequest } from '../../auth/config/user.request';
import { TagDto } from '../dto/tag.dto';
import { Teacher } from '../../user/entity/teacher.entity';
import { NotAuthorQuestionException } from '../exception/notAuthorQuestion.exception';
import { QuestionNotFoundException } from '../exception/questionNotFound.exception';
import { TagNotFoundException } from '../exception/tagNotFound.exception';
import { NotAuthorTagException } from '../exception/notAuthorTag.exception';

@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Roles([UserType.TEACHER])
  @Get('/:id/')
  async selectQuestion(
    @Param('id', ParseIntPipe) idQuestion: number,
    @Req() request: UserRequest,
  ) {
    if (!(await this.questionService.questionExists(idQuestion)))
      throw new QuestionNotFoundException();
    if (
      !(await this.questionService.isQuestionFromTeacher(
        idQuestion,
        request.user as Teacher,
      ))
    )
      throw new NotAuthorQuestionException();
    return this.questionService.findQuestion(idQuestion);
  }

  @Roles([UserType.TEACHER])
  @Get('/user/questions')
  async getQuestionsPrivateBank(@Req() request: UserRequest) {
    return await this.questionService.getQuestionPrivateBank(
      request.user as Teacher,
    );
  }

  @Roles([UserType.TEACHER])
  @Get('/:id/select-answers/')
  async selectAnswersFromQuestion(
    @Param('id', ParseIntPipe) idQuestion: number,
    @Req() request: UserRequest,
  ) {
    if (!(await this.questionService.questionExists(idQuestion)))
      throw new QuestionNotFoundException();
    if (
      !(await this.questionService.isQuestionFromTeacher(
        idQuestion,
        request.user as Teacher,
      ))
    )
      throw new NotAuthorQuestionException();
    return this.questionService.findAnswers(idQuestion);
  }

  @Roles([UserType.TEACHER])
  @Post('/tag')
  createTag(
    @Req() request: UserRequest,
    @Body(new ValidationPipe()) tagDto: TagDto,
  ) {
    return this.questionService.createTag(request.user as Teacher, tagDto);
  }

  @Roles([UserType.TEACHER])
  @Patch('/tag/:id')
  async updateTag(
    @Param('id', ParseIntPipe) idTag: number,
    @Body(new ValidationPipe()) newTag: TagDto,
    @Req() request: UserRequest,
  ) {
    if (!(await this.questionService.tagExists(idTag)))
      throw new TagNotFoundException();
    if (
      !(await this.questionService.isTagFromTeacher(
        idTag,
        request.user as Teacher,
      ))
    )
      throw new NotAuthorTagException();
    return this.questionService.updateTag(idTag, newTag);
  }

  @Roles([UserType.TEACHER])
  @Delete('/tag/:id')
  async deleteTag(
    @Param('id', ParseIntPipe) idTag: number,
    @Req() request: UserRequest,
  ) {
    if (!(await this.questionService.tagExists(idTag)))
      throw new TagNotFoundException();
    if (
      !(await this.questionService.isTagFromTeacher(
        idTag,
        request.user as Teacher,
      ))
    )
      throw new NotAuthorTagException();
    return this.questionService.deleteTag(idTag);
  }

  @Roles([UserType.TEACHER])
  @Get('/tag/:id')
  async getTag(
    @Param('id', ParseIntPipe) idTag: number,
    @Req() request: UserRequest,
  ) {
    if (!(await this.questionService.tagExists(idTag)))
      throw new TagNotFoundException();
    if (
      !(await this.questionService.isTagFromTeacher(
        idTag,
        request.user as Teacher,
      ))
    )
      throw new NotAuthorTagException();
    return this.questionService.getTag(idTag);
  }

  @Roles([UserType.TEACHER])
  @Get('/tag/user/')
  getTags(@Req() request: UserRequest) {
    return this.questionService.getTags(request.user as Teacher);
  }
}
