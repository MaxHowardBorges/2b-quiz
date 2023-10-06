import { Module } from '@nestjs/common';
import { QuestionnaryController } from '../controller/questionnary.controller';
import { QuestionnaryService } from '../service/questionnary.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Questionnary } from '../entity/questionnary.entity';
import { Question } from '../../question/entity/question.entity';
import { Answer } from '../../question/entity/answer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Questionnary, Question, Answer])],
  controllers: [QuestionnaryController],
  providers: [QuestionnaryService],
})
export class QuestionnaryModule {}
