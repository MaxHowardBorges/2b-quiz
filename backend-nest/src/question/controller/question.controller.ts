import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { QuestionService } from '../service/question.service';

@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Get('/:id/')
  selectQuestion(@Param('id', ParseIntPipe) idQuestion: number) {
    return this.questionService.findQuestion(idQuestion);
  }

  @Get('/:id/select-answers/')
  selectAnswersFromQuestion(@Param('id', ParseIntPipe) idQuestion: number) {
    return this.questionService.findAnswers(idQuestion);
  }
}
