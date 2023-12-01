import { Test, TestingModule } from '@nestjs/testing';
import { SessionController } from './session.controller';
import { SessionService } from '../service/session.service';
import { Session } from '../session';
import { QuestionService } from '../../question/service/question.service';
import { EventService } from '../../event/service/event.service';
import { AnswerMapper } from '../../question/mapper/answer.mapper';
import { SessionMapper } from '../mapper/session.mapper';
import { GetCurrentQuestionDto } from '../dto/getCurrentQuestion.dto';
import { Question } from '../../question/entity/question.entity';
import { Answer } from '../../question/entity/answer.entity';

describe('SessionController', () => {});
