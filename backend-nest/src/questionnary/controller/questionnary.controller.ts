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

@Controller('questionnary')
export class QuestionnaryController {
  constructor(private readonly questionnaryService: QuestionnaryService) {}
  @Post('/create')
  createQuestionnary(
    @Body(new ValidationPipe()) questionnaryDto: QuestionnaryCreateDto,
  ) {
    return this.questionnaryService.createQuestionnary(
      questionnaryDto.title,
      questionnaryDto.questions,
      questionnaryDto.author,
    );
  }

  @Delete('/:id')
  async deleteQuestionnary(@Param('id', ParseIntPipe) idQuestionnary: number) {
    return this.questionnaryService.deleteQuestionnary(idQuestionnary);
  }

  @Get('/select/:id')
  selectQuestionnary(@Param('id', ParseIntPipe) idQuestionnary: number) {
    return this.questionnaryService.findQuestionnary(idQuestionnary);
  }

  @Post('/:id/add-question')
  addQuestion(
    @Param('id', ParseIntPipe) idQuestionnary: number,
    @Body(new ValidationPipe()) questionDto: QuestionCreateDto,
  ) {
    return this.questionnaryService.addQuestion(idQuestionnary, questionDto);
  }

  @Delete('/:id/remove-question/:idQ')
  async deleteQuestion(
    @Param('id', ParseIntPipe) idQuestionnary: number,
    @Param('idQ', ParseIntPipe) idQuestion: number,
  ) {
    return this.questionnaryService.deleteQuestion(idQuestionnary, idQuestion);
  }

  @Patch('/:id/modify-question/:idQ')
  modifyQuestion(
    @Param('id', ParseIntPipe) idQuestionnary: number,
    @Param('idQ', ParseIntPipe) idQuestion: number,
    @Body(new ValidationPipe()) questionDto: QuestionCreateDto,
  ) {
    return this.questionnaryService.modifyQuestion(
      idQuestionnary,
      idQuestion,
      questionDto,
    );
  }

  @Post('/show-answer') //TODO
  showAnswer(@Body(new ValidationPipe()) idQuestion: number) {
    return this.questionnaryService.showAnswer(idQuestion);
  }
}
