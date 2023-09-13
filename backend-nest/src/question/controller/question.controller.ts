import { Controller, Get } from '@nestjs/common';
import { Question } from '../entity/question.entity';
import { QuestionService } from '../service/question.service';

@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}
  @Get()
  async findAll(): Promise<Question[]> {
    return await this.questionService.findAllWithQuestion();
  }
}
