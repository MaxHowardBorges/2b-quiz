import { Test, TestingModule } from '@nestjs/testing';
import { SessionService } from './session.service';
import { QuestionService } from '../../question/service/question.service';
import { AnswerMapper } from '../../question/mapper/answer.mapper';
import { EventService } from '../../event/service/event.service';
import { SessionTemp } from '../temp/sessionTemp';
import { Question } from '../../question/entity/question.entity';
import { Questionnary } from '../../questionnary/entity/questionnary.entity';
import { QuestionType } from '../../question/constants/questionType.constant';
import { Answer } from '../../question/entity/answer.entity';
import { QuestionnaryService } from '../../questionnary/service/questionnary.service';
import { generateTeacherMock } from '../../../test/mock/user.mock';
import { ParticipantInterface } from '../../user/interface/participant.interface';
import { DisplaySettingsObject } from '../object/displaySettings.object';
import { SettingsObject } from '../object/settings.object';
import { TestBed } from '@automock/jest';
import { UserService } from '../../user/service/user.service';
import { SessionMapper } from '../mapper/session.mapper';
import { Repository } from 'typeorm';
import { Session } from '../entity/session.entity';
import { UserSession } from '../entity/userSession.entity';

describe('SessionService', () => {
  let service: SessionService;
  let questionService: jest.Mocked<QuestionService>;
  let questionnaryService: jest.Mocked<QuestionnaryService>;
  let userService: jest.Mocked<UserService>;
  let answerMapper: jest.Mocked<AnswerMapper>;
  let eventService: jest.Mocked<EventService>;
  let sessionMapper: jest.Mocked<SessionMapper>;
  let sessionRepository: jest.Mocked<Repository<Session>>;
  let userSessionRepository: jest.Mocked<Repository<UserSession>>;
  let sessionMap: Map<string, SessionTemp>;

  const hostTeacher = generateTeacherMock();

  const questionnary: Questionnary = {
    id: 15,
    title: 'morocco',
    author: hostTeacher,
    questions: [],
    isCompilated: false,
  };
  const questions: Question[] = [
    {
      id: 36,
      content: 'Quelle est la capitale du Maroc?',
      questionnary: questionnary,
      type: QuestionType.QCU,
      answers: [],
      tags: [],
      author: null,
      equals(question: Question): boolean {
        return this.id === question.id;
      },
    },
    {
      id: 37,
      content: 'Qui a écrit "Romeo et Juliette"?',
      questionnary: questionnary,
      type: QuestionType.QCU,
      answers: [],
      tags: [],
      author: null,
      equals(question: Question): boolean {
        return this.id === question.id;
      },
    },
    {
      id: 38,
      content: "Quel est le symbole chimique de l'oxygène?",
      questionnary: questionnary,
      type: QuestionType.QCU,
      answers: [],
      tags: [],
      author: null,
      equals(question: Question): boolean {
        return this.id === question.id;
      },
    },
  ];

  const answers1: Answer[] = [
    {
      id: 104,
      content: 'Tunis',
      isCorrect: false,
      question: questions[0],
    },
    {
      id: 105,
      content: 'Aggrabah',
      isCorrect: false,
      question: questions[0],
    },
    {
      id: 106,
      content: 'Rabat',
      isCorrect: true,
      question: questions[0],
    },
  ];
  const answers2: Answer[] = [
    {
      id: 107,
      content: 'William Shakespeare',
      isCorrect: true,
      question: questions[1],
    },
    {
      id: 108,
      content: 'Charles Dickens',
      isCorrect: false,
      question: questions[1],
    },
    {
      id: 109,
      content: 'Jane Austen',
      isCorrect: false,
      question: questions[1],
    },
    {
      id: 110,
      content: 'George Orwell',
      isCorrect: false,
      question: questions[1],
    },
  ];
  const answers3: Answer[] = [
    {
      id: 111,
      content: 'O',
      isCorrect: true,
      question: questions[2],
    },
    {
      id: 112,
      content: 'H',
      isCorrect: false,
      question: questions[2],
    },
    {
      id: 113,
      content: 'C',
      isCorrect: false,
      question: questions[2],
    },
    {
      id: 114,
      content: 'N',
      isCorrect: false,
      question: questions[2],
    },
    {
      id: 115,
      content: 'S',
      isCorrect: false,
      question: questions[2],
    },
  ];

  questions[0].answers = answers1;
  questions[1].answers = answers2;
  questions[2].answers = answers3;

  questionnary.questions = questions;

  const questionnaryTest = new Questionnary();
  questionnaryTest.questions = questions;
  questionnaryTest.id = 15;
  questionnaryTest.author = hostTeacher;
  questionnaryTest.title = 'morocco';

  beforeAll(() => {
    const { unit, unitRef } = TestBed.create(SessionService).compile();

    service = unit;
    questionService = unitRef.get(QuestionService);
    questionnaryService = unitRef.get(QuestionnaryService);
    userService = unitRef.get(UserService);
    answerMapper = unitRef.get(AnswerMapper);
    eventService = unitRef.get(EventService);
    sessionMapper = unitRef.get(SessionMapper);
    sessionRepository = unitRef.get('SessionRepository');
    userSessionRepository = unitRef.get('UserSessionRepository');
  });

  describe('initializeSession', () => {
    it('generate idSession : should be returned an idSession, should be a STRING', async () => {
      const test = service.generateIdSession();
      expect(typeof test).toBe('string');
      expect(test.length).toEqual(6);
      expect(typeof test).not.toBe('Integer');
    });
    //TODO BROKEN TEST
    /* it('initializeSession : should be not equal to the empty session', async () => {
      mockQuestionnaryService.findQuestionnaryWithQuestionsId.mockResolvedValue(
        questionnary.questions,
      );
      const testSession = await service.initializeSession(
        hostTeacher,
        [questionnary.id],
        new SettingsObject(new DisplaySettingsObject(true, true)),
        [],
        [],
      );
      expect(testSession).not.toEqual(session);
      expect(testSession).toBeInstanceOf(SessionTemp);
      expect(testSession.id).not.toBeNull();
      expect(testSession.id).not.toMatch(/[a-zÀ-ÿ]/);
    });
  });

  describe('CreateSession', () => {
    it('should create a session and return a Session', async () => {
      let test = await service.createSession(
        service.generateIdSession(),
        hostTeacher,
        [questionnary],
        new SettingsObject(new DisplaySettingsObject(true, true)),
      );
      expect(test).toBeInstanceOf(SessionTemp);
      expect(typeof test.id).toBe('string');
    });
  });
*/

    // describe('nextQuestion', () => {
    //   it('should return the next question', async () => {
    //     mockMap.get.mockReturnValue(session);
    //     mockQuestionnaryService.findQuestionsFromIdQuestionnary.mockResolvedValue(
    //       questions,
    //     );
    //     mockQuestionService.findQuestion.mockResolvedValue(questions[0]);
    //     const mockSessionMap = new Map<string, SessionTemp>();
    //     mockSessionMap.set('111111', session);
    //     (service as any).sessionMap = mockSessionMap;
    //
    //     let test = await service.nextQuestion('111111');
    //     expect(test).not.toBeNull();
    //     expect(test).not.toEqual(session);
    //     let session2: SessionTemp = session;
    //     let quest = new Question();
    //     quest.answers = [];
    //
    //     session2.questionNumber = 0;
    //     mockSessionMap.set('111111', session2);
    //     (service as any).sessionMap = mockSessionMap;
    //     let test2 = await service.nextQuestion('111111');
    //     expect(test2).not.toEqual(quest);
    //   });
    // });

    //TODO NOT WORKING
    /*describe('currentQuestion', () => {
    it('should return the current question', async () => {
      const mockSessionMap = new Map<string, Session>();
      mockSessionMap.set('111111', session);
      (service as any).sessionMap = mockSessionMap;
      mockAnswerMapper.mapAnswersStudentDtos.mockReturnValue(undefined);
      mockQuestionService.findQuestion(questions[1].id);
      let test = service.currentQuestion('111111');
      expect(test).toBeTruthy();

      mockAnswerMapper.mapAnswersStudentDtos.mockResolvedValue(
        new AnswerMapper(),
      );
    });*/
  });
});
