import { Controller } from '@nestjs/common';
import { Session } from './session';
import { QuestionService } from '../question/service/question.service';

@Controller('session')
export class SessionController {
  private sessionMap: Map<string, Session>;
  constructor(private questionService: QuestionService) {}
}
