import { Body, Controller, Delete, Get, Post, Req } from '@nestjs/common';
import { Question } from '../entity/question.entity';
import { QuestionService } from '../service/question.service';
import { UserUpdateDto } from '../dto/idSession.dto';
import { QuestionDto } from '../dto/question.dto';
import { Questionnary } from '../../questionnary/entity/questionnary.entity';

@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}
  @Get()
  async findAll(): Promise<Question[]> {
    return await this.questionService.findAllWithQuestion();
  }

  @Post('/nextquestion')
  async nextQuestion(@Body() dto: UserUpdateDto): Promise<Question> {
    return await this.questionService.findOne(dto.id);
  }
}
