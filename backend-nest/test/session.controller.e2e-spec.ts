// Session controller end to end test

import { INestApplication } from '@nestjs/common';
import { testTypeOrmConfig } from './testDatabase.config';
import { createTestDatabase } from './setupTest';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';

describe('SessionController (e2e)', () => {
  let app: INestApplication;
  let token: string;
  let testTypeOrmConfigOptions = testTypeOrmConfig;

  beforeAll(async () => {
    await createTestDatabase(testTypeOrmConfigOptions);
  }, 60000);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(testTypeOrmConfigOptions), AppModule],
    }).compile();

    app = module.createNestApplication({});
    await app.init();
    //wait for migration to finish
    await new Promise((resolve) => setTimeout(resolve, 20000));

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/dev/login')
      .send({
        username: 'Noel.Breton1',
      })
      .expect(201);

    token = loginResponse.body.access_token;
  }, 60000);

  describe('Session (e2e)', () => {
    // End to end test for session
    //Create session
    it('createSession', async () => {
      let session = await request(app.getHttpServer())
        .post('/session/create')
        .set('Authorization', `Bearer ${token}`)
        .send({
          questionnaryList: [],
          settings: {
            accessType: 'PUBLIC',
            displaySettings: {
              displayQuestion: true,
              displayAnswer: true,
            },
            isResult: true,
            isGlobal: true,
            isResponses: true,
          },
          whitelist: [],
          whitelistGroups: [],
        })
        .expect(201);
    });
    it('nextQuestion', async () => {
      let session = await request(app.getHttpServer())
        .post('/session/create')
        .set('Authorization', `Bearer ${token}`)
        .send({
          questionnaryList: [],
          settings: {
            accessType: 'PUBLIC',
            displaySettings: {
              displayQuestion: true,
              displayAnswer: true,
            },
            isResult: true,
            isGlobal: true,
            isResponses: true,
          },
          whitelist: [],
          whitelistGroups: [],
        })
        .expect(201);

      session = await request(app.getHttpServer())
        .get(`/session/${session.body.id}/next`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });
    it('ListSession', async () => {
      let session = await request(app.getHttpServer())
        .get(`/session/getSessionsList`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });
    it('joinSession', async () => {
      let session = await request(app.getHttpServer())
        .post('/session/create')
        .set('Authorization', `Bearer ${token}`)
        .send({
          questionnaryList: [],
          settings: {
            accessType: 'PUBLIC',
            displaySettings: {
              displayQuestion: true,
              displayAnswer: true,
            },
            isResult: true,
            isGlobal: true,
            isResponses: true,
          },
        })
        .expect(201);
      session = await request(app.getHttpServer())
        .post('/session/' + session.body.id + '/join')
        .set('Authorization', `Bearer ${token}`)
        .expect(403);
    });

    it('getSessionStatus', async () => {
      let session = await request(app.getHttpServer())
        .post('/session/create')
        .set('Authorization', `Bearer ${token}`)
        .send({
          questionnaryList: [],
          settings: {
            accessType: 'PUBLIC',
            displaySettings: {
              displayQuestion: true,
              displayAnswer: true,
            },
            isResult: true,
            isGlobal: true,
            isResponses: true,
          },
          whitelist: [],
          whitelistGroups: [],
        })
        .expect(201);

      session = await request(app.getHttpServer())
        .get('/session/' + session.body.id + '/status')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });
  });
});
