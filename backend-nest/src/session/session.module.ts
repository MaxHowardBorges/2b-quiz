import { Module } from '@nestjs/common';
import { SessionController } from './controller/session.controller';
import { SessionService } from './service/session.service';
import { QuestionModule } from '../question/question.module';
import { QuestionService } from '../question/service/question.service';
import { SessionMapper } from './mapper/session.mapper';

@Module({
  controllers: [SessionController],
  providers: [SessionService, SessionMapper, QuestionService],
  imports: [QuestionModule],
})
export class SessionModule {}
