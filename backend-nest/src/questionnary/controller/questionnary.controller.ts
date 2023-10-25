import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { QuestionnaryService } from '../service/questionnary.service';
import { QuestionDto } from '../../question/dto/question.dto';
import { QuestionnaryDto } from '../dto/questionnary.dto';

@Controller('questionnary')
export class QuestionnaryController {
  constructor(private readonly questionnaryService: QuestionnaryService) {}
  @Post('/create')
  createQuestionnary(
    @Body(new ValidationPipe()) questionnaryDto : QuestionnaryDto
  ) {
    return this.questionnaryService.createQuestionnary(
      questionnaryDto.title,
      questionnaryDto.questions,
      questionnaryDto.author,
    );
  }

  @Post('/delete')
  deleteQuestionnary(
    @Body(new ValidationPipe()) body: {idQuestionnary : number}
  ) {
    return this.questionnaryService.deleteQuestionnary(body.idQuestionnary);
  }
}
