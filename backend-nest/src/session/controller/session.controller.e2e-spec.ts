import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../app.module';
import * as request from 'supertest';
import { Session } from '../session';
import { Question } from '../../question/entity/question.entity';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication({ cors: true });
    await app.init();
  });

  describe('Session (e2e)', () => {
    it('createSession', async () => {
      let session = await request('http://localhost:3000/session').post(
        '/create',
      );
      expect(session.status).toBe(201);
      expect(session.noContent).toBeFalsy();
      //console.log(session.body.id);
      expect(typeof session.body.id).toBe('string');
    });
    it('nextQuestion', async () => {
      let session = await request('http://localhost:3000/session').post(
        '/create',
      );
      let nextQ = await request('http://localhost:3000/session')
        .post('/nextQuestion')
        .send({ idSession: session.body.id });
      //console.log(nextQ.body);
      expect(nextQ.status).toBe(201);
      expect(nextQ.noContent).toBeFalsy();
      expect(nextQ.body.answers.length).toBeGreaterThanOrEqual(2);
      expect(nextQ.body.id).not.toBeNull();
      expect(typeof nextQ.body.content).toBe('string');
    });
  });

  /*it('question', async () => {
    await request('http://localhost:3000').get('/question').expect(200);
  });*/

  /*it('question', async () => {
    console.log(request(app.getHttpServer()).get('/question'));
    return await request(app.getHttpServer()).get('/question').expect(201);
  });*/
});
