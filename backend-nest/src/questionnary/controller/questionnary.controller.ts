import { Body, Controller, Post } from '@nestjs/common';
import { QuestionnaryService } from '../service/questionnary.service';
import { QuestionDto } from '../../question/dto/question.dto';

@Controller('questionnary')
export class QuestionnaryController {
  constructor(private readonly questionnaryService: QuestionnaryService) {}
  @Post('/create')
  createQuestionnary(
    @Body() body: { questions: QuestionDto[]; title: string; author: string },
  ) {
    return this.questionnaryService.createQuestionnary(
      body.title,
      body.questions,
      body.author,
    );
  }
}
