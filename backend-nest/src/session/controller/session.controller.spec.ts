import { Test, TestingModule } from '@nestjs/testing';
import { SessionController } from './session.controller';
import { SessionService } from '../service/session.service';
import { SessionMapper } from '../mapper/session.mapper';
import { BodyEmptyException } from '../exception/bodyEmpty.exception';
import { Question } from '../../question/entity/question.entity';
import { Session } from '../session';
import { QuestionService } from '../../question/service/question.service';
import { QuestionModule } from '../../question/question.module';
import { EventService } from '../../event/service/event.service';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('SessionController', () => {
  let sessionController: SessionController;
  let sessionService: SessionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SessionController],
      providers: [SessionService, SessionMapper, QuestionService, EventService],
      imports: [
        QuestionModule,
        TypeOrmModule.forRoot({
          // Configurez TypeOrmModule pour vos tests
          type: 'sqlite', // Par exemple, utilisez SQLite pour les tests
          database: ':memory:', // Utilisez une base de données en mémoire pour les tests
          entities: [Question], // Ajoutez vos entités ici
          synchronize: true, // Synchronisez la base de données (pour les tests seulement)
        }),
      ],
    }).compile();

    sessionController = module.get<SessionController>(SessionController);
    sessionService = module.get<SessionService>(SessionService);
  });

  describe('createSession', () => {
    it('should create a new session', async () => {
      const result = new Session('', []); // Replace with your expected session object
      jest.spyOn(sessionService, 'initializeSession').mockResolvedValue(result);

      expect(await sessionController.createSession()).toBe(result);
    });
  });

  describe('nextQuestion', () => {
    it('should return the next question', () => {
      const requestBody = { id: 'session_id' };
      const result = {} as Question; // Replace with your expected question object

      jest.spyOn(sessionService, 'nextQuestion').mockReturnValue(result);

      expect(sessionController.nextQuestion(requestBody)).toBe(result);
    });

    it('should throw BodyEmptyException when id is undefined', () => {
      const requestBody = { id: undefined };

      expect(() => sessionController.nextQuestion(requestBody)).toThrow(
        BodyEmptyException,
      );
    });
  });

  // Add similar test cases for other methods like joinSession, getCurrentQuestion, respondQuestion, and getMap
});
