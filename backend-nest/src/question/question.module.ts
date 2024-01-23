import { Module } from '@nestjs/common';
import { QuestionService } from './service/question.service';
import { QuestionController } from './controller/question.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Answer } from './entity/answer.entity';
import { Question } from './entity/question.entity';
import { AnswerMapper } from './mapper/answer.mapper';
import { Tag } from './entity/tag.entity';
import { TagMapper } from './mapper/tag.mapper';
import { QuestionMapper } from './mapper/question.mapper';

@Module({
  imports: [TypeOrmModule.forFeature([Answer, Question, Tag])],
  exports: [
    TypeOrmModule,
    QuestionService,
    QuestionMapper,
    AnswerMapper,
    TagMapper,
  ],
  controllers: [QuestionController],
  providers: [QuestionService, QuestionMapper, AnswerMapper, TagMapper],
})
export class QuestionModule {}
