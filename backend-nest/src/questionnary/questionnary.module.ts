import { Module } from '@nestjs/common';
import { QuestionnaryController } from './controller/questionnary.controller';
import { QuestionnaryService } from './service/questionnary.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Questionnary } from './entity/questionnary.entity';
import { QuestionModule } from '../question/question.module';

@Module({
  imports: [TypeOrmModule.forFeature([Questionnary]),QuestionModule],
  controllers: [QuestionnaryController],
  providers: [QuestionnaryService],
})
export class QuestionnaryModule {}
