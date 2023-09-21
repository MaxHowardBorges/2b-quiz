import { Module } from '@nestjs/common';
import { SessionController } from './controller/session.controller';
import { SessionService } from './service/session.service';
import { QuestionModule } from '../question/question.module';
import { AnswerMapper } from '../question/mapper/answer.mapper';
import { QuestionService } from '../question/service/question.service';

@Module({
  controllers: [SessionController],
  providers: [SessionService, AnswerMapper, QuestionService],
  imports: [QuestionModule],
})
export class SessionModule {}
