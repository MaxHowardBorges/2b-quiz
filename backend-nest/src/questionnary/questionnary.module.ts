import { Module } from '@nestjs/common';
import { QuestionnaryController } from './controller/questionnary.controller';
import { QuestionnaryService } from './service/questionnary.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Questionnary } from './entity/questionnary.entity';
import { QuestionModule } from '../question/question.module';
import { QuestionnaryMapper } from './mapper/questionnary.mapper';

@Module({
  imports: [TypeOrmModule.forFeature([Questionnary]), QuestionModule],
  exports: [TypeOrmModule, QuestionnaryService, QuestionnaryMapper],
  controllers: [QuestionnaryController],
  providers: [QuestionnaryService, QuestionnaryMapper],
})
export class QuestionnaryModule {}
