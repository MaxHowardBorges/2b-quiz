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

  @Post('/create')
  createQuestionnary(
    @Body(new ValidationPipe()) questionnaryDto: QuestionnaryCreateDto,
  ) {
    return this.questionnaryService.createQuestionnary(questionnaryDto);
  }

  @Delete('/:id')
  async deleteQuestionnary(@Param('id', ParseIntPipe) idQuestionnary: number) {
    return this.questionnaryService.deleteQuestionnary(idQuestionnary);
  }

  @Get('/:id')
  selectQuestionnary(@Param('id', ParseIntPipe) idQuestionnary: number) {
    return this.questionnaryService.findQuestionnary(idQuestionnary);
  }

  @Get('/user/:idUser')
  selectQuestionnariesFromUser(@Param('idUser', ParseIntPipe) idUser: number) {
    return this.questionnaryService.findQuestionnariesFromIdUser(idUser);
  }

  @Get('/:id/question/')
  selectQuestionsFromQuestionnary(
    @Param('id', ParseIntPipe) idQuestionnary: number,
  ) {
    return this.questionnaryService.findQuestionsFromIdQuestionnary(
      idQuestionnary,
    );
  }

  @Post('/:id/question/')
  async addQuestion(
    @Param('id', ParseIntPipe) idQuestionnary: number,
    @Body(new ValidationPipe()) questionDto: QuestionCreateDto,
  ) {
    return this.questionnaryService.addQuestion(idQuestionnary, questionDto);
  }

  @Get('/user/:idUser/questions')
  async getQuestionsPrivateBank(@Param('idUser', ParseIntPipe) idUser: number) {
    return await this.questionService.getQuestionPrivateBank(idUser);
  }

  @Delete('/:id/question/:idQuestion')
  async deleteQuestion(
    @Param('id', ParseIntPipe) idQuestionnary: number,
    @Param('idQuestion', ParseIntPipe) idQuestion: number,
  ) {
    return this.questionnaryService.deleteQuestion(idQuestionnary, idQuestion);
  }

  @Patch('/:id/question/:idQuestion')
  async modifyQuestion(
    @Param('id', ParseIntPipe) idQuestionnary: number,
    @Param('idQuestion', ParseIntPipe) idQuestion: number,
    @Body(new ValidationPipe()) questionDto: QuestionCreateDto,
  ) {
    return this.questionnaryService.modifyQuestion(
      idQuestionnary,
      idQuestion,
      questionDto,
    );
  }

  @Patch('/:id')
  modifyQuestionnary(
    @Param('id', ParseIntPipe) idQuestionnary: number,
    @Body() body: { questionnaryName: string },
  ) {
    return this.questionnaryService.modifyQuestionnary(
      idQuestionnary,
      body.questionnaryName,
      //body.author,
    );
  }
}
