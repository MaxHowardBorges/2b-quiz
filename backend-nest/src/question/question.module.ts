import { Module } from '@nestjs/common';
import { QuestionService } from './service/question.service';
import { QuestionController } from './controller/question.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Answer } from './entity/answer.entity';
import { Question } from './entity/question.entity';
import { AnswerMapper } from './mapper/answer.mapper';

@Module({
  imports: [TypeOrmModule.forFeature([Answer, Question])],
  exports: [TypeOrmModule, QuestionService, AnswerMapper],
  controllers: [QuestionController],
  providers: [QuestionService, AnswerMapper],
})
export class QuestionModule {}
