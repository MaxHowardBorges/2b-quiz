import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../app.module';
import * as request from 'supertest';

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

      expect(typeof session.body.id).toBe('string');
    });
    it('nextQuestion', async () => {
      let session = await request('http://localhost:3000/session').post(
        '/create',
      );
      let nextQ = await request('http://localhost:3000/session')
        .post('/nextQuestion')
        .send({ idSession: session.body.id });

      expect(nextQ.status).toBe(201);
      expect(nextQ.noContent).toBeFalsy();
      expect(nextQ.body.answers.length).toBeGreaterThanOrEqual(2);
      expect(nextQ.body.id).not.toBeNull();
      expect(typeof nextQ.body.content).toBe('string');
    });
    it('getCurrentQuestion', async () => {
      let session = await request('http://localhost:3000/session').post(
        '/create',
      );
      let currentQ = await request('http://localhost:3000/session')
        .post('/question/current')
        .send({ idSession: session.body.id });

      expect(currentQ.status).toBe(500);
      expect(currentQ.noContent).toBeFalsy();
      await request('http://localhost:3000/session')
        .post('/nextQuestion')
        .send({ idSession: session.body.id });

      currentQ = await request('http://localhost:3000/session')
        .post('/question/current')
        .send({ idSession: session.body.id });

      expect(currentQ.status).toBe(201);
      expect(currentQ.body.answers.length).toBeGreaterThanOrEqual(2);
      expect(currentQ.body.id).not.toBeNull();
      expect(typeof currentQ.body.content).toBe('string');
    });
  });
});
