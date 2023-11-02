import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { QuestionnaryService } from '../service/questionnary.service';
import { QuestionnaryDto } from '../dto/questionnary.dto';

@Controller('questionnary')
export class QuestionnaryController {
  constructor(private readonly questionnaryService: QuestionnaryService) {}
  @Post('/create')
  createQuestionnary(
    @Body(new ValidationPipe()) questionnaryDto: QuestionnaryDto,
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
}
