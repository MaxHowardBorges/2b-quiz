import { EventService } from './event.service';
import { TestBed } from '@automock/jest';
import { Teacher } from '../../user/entity/teacher.entity';
import { ParticipantInterface } from '../../user/interface/participant.interface';
import {
  generateRandomParticipantMockList,
  generateTeacherMock,
} from '../../../test/mock/user.mock';
import { EventEnum } from '../enum/event.enum';
import { Subject } from 'rxjs';
import { SessionNotFoundException } from '../exception/sessionNotFound.exception';
import { UserUnauthorisedException } from '../exception/userUnauthorised.exception';
import { ParticipantSessionObject } from '../object/participantSession.object';

describe('EventService', () => {
  let service: EventService;
  let host: Teacher;
  let participant: ParticipantInterface[];
  let otherParticipant: ParticipantInterface;

  beforeEach(async () => {
    const { unit } = TestBed.create(EventService).compile();

    service = unit;
    host = generateTeacherMock();
    participant = generateRandomParticipantMockList(5);
    otherParticipant = generateRandomParticipantMockList(1)[0];
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  //sendEvent
  describe('sendEvent', () => {
    it('should send event to all participants', () => {
      const idSession = '123456';
      service.createSessionGroup(idSession, host.id, participant);
      service.sendEvent(EventEnum.NEXT_QUESTION, idSession);
      expect(service.getSession(idSession)).toBeDefined();
      expect(
        service.getSession(idSession).getParticipantSubjectList().length,
      ).toBe(5);
    });
  });

  //createSessionGroup
  describe('createSessionGroup', () => {
    it('should create a session group with participantList', () => {
      const idSession = '123456';
      service.createSessionGroup(idSession, host.id, participant);
      expect(service.getSession(idSession)).toBeDefined();
      expect(service.getSession(idSession).isPrivateSession()).toBeTruthy();
      expect(service.getSession(idSession).checkIdHost(host.id)).toBeTruthy();
    });
    it('should create a session group without participantList', () => {
      const idSession = '123456';
      service.createSessionGroup(idSession, host.id);
      expect(service.getSession(idSession)).toBeDefined();
      expect(service.getSession(idSession).isPrivateSession()).toBeFalsy();
      expect(service.getSession(idSession).checkIdHost(host.id)).toBeTruthy();
    });
  });

  //createClient
  describe('createClient', () => {
    it('should create a client', async () => {
      const idSession = '123456';
      service.createSessionGroup(idSession, host.id, participant);
      const client = await service.createClient(idSession, participant[0].id);
      expect(client).toBeDefined();
      expect(client).toBeInstanceOf(Subject<string>);
      const idSession2 = '123486';
      service.createSessionGroup(idSession2, host.id);
      const client2 = await service.createClient(idSession, participant[0].id);
      expect(client2).toBeDefined();
      expect(client2).toBeInstanceOf(Subject<string>);
    });
    it('should throw an error if session not found', async () => {
      const idSession = '123456';
      const idSessionOther = '124556';
      service.createSessionGroup(idSession, host.id, participant);
      await expect(
        service.createClient(idSessionOther, participant[0].id),
      ).rejects.toThrow(SessionNotFoundException);
    });
    it('should throw an error if user not in session', async () => {
      const idSession = '123456';
      service.createSessionGroup(idSession, host.id, participant);
      await expect(
        service.createClient(idSession, otherParticipant.id),
      ).rejects.toThrow(UserUnauthorisedException);
    });
  });

  //removeClient
  describe('removeClient', () => {
    it('should remove a client', async () => {
      const idSession = '123456';
      service.createSessionGroup(idSession, host.id, participant);
      await service.createClient(idSession, participant[0].id);
      await service.removeClient(idSession, participant[0].id);
      const idSession2 = '123486';
      service.createSessionGroup(idSession2, host.id);
      await service.createClient(idSession2, participant[0].id);
      await service.removeClient(idSession2, participant[0].id);
    });
    it('should throw an error if user not found', async () => {
      const idSession = '123456';
      service.createSessionGroup(idSession, host.id, participant);
      await expect(
        service.removeClient(idSession, otherParticipant.id),
      ).rejects.toThrow(UserUnauthorisedException);
      const idSession2 = '123486';
      service.createSessionGroup(idSession2, host.id);
      await expect(
        service.removeClient(idSession2, otherParticipant.id),
      ).rejects.toThrow(UserUnauthorisedException);
    });
  });

  //createObserver
  describe('createObserver', () => {
    it('should create an observer', async () => {
      const idSession = '123456';
      service.createSessionGroup(idSession, host.id, participant);
      const observer = await service.createObserver(idSession, host.id);
      expect(observer).toBeDefined();
      expect(observer).toBeInstanceOf(Subject<string>);
    });
    it('should throw an error if session not found', async () => {
      const idSession = '123456';
      const idSessionOther = '124556';
      service.createSessionGroup(idSession, host.id, participant);
      await expect(
        service.createObserver(idSessionOther, host.id),
      ).rejects.toThrow(SessionNotFoundException);
    });
    it('should throw an error if user not host', async () => {
      const idSession = '123456';
      service.createSessionGroup(idSession, host.id, participant);
      await expect(
        service.createObserver(idSession, otherParticipant.id),
      ).rejects.toThrow(UserUnauthorisedException);
    });
  });

  //removeObserver
  describe('removeObserver', () => {
    it('should remove an observer', async () => {
      const idSession = '123456';
      service.createSessionGroup(idSession, host.id, participant);
      await service.createObserver(idSession, host.id);
      await service.removeObserver(idSession, host.id);
    });
    it('should throw an error if user not host', async () => {
      const idSession = '123456';
      service.createSessionGroup(idSession, host.id, participant);
      await expect(
        service.removeObserver(idSession, otherParticipant.id),
      ).rejects.toThrow(UserUnauthorisedException);
    });
  });

  //createHost
  describe('createHost', () => {
    it('should create a host', async () => {
      const idSession = '123456';
      service.createSessionGroup(idSession, host.id, participant);
      const hostSubject = await service.createHost(idSession, host.id);
      expect(hostSubject).toBeDefined();
      expect(hostSubject).toBeInstanceOf(Subject<string>);
    });
    it('should throw an error if session not found', async () => {
      const idSession = '123456';
      const idSessionOther = '124556';
      service.createSessionGroup(idSession, host.id, participant);
      await expect(service.createHost(idSessionOther, host.id)).rejects.toThrow(
        SessionNotFoundException,
      );
    });
    it('should throw an error if user not host', async () => {
      const idSession = '123456';
      service.createSessionGroup(idSession, host.id, participant);
      await expect(
        service.createHost(idSession, otherParticipant.id),
      ).rejects.toThrow(UserUnauthorisedException);
    });
  });

  //removeHost
  describe('removeHost', () => {
    it('should remove a host', async () => {
      const idSession = '123456';
      service.createSessionGroup(idSession, host.id, participant);
      await service.createHost(idSession, host.id);
      await service.removeHost(idSession, host.id);
    });
    it('should throw an error if user not host', async () => {
      const idSession = '123456';
      service.createSessionGroup(idSession, host.id, participant);
      await expect(
        service.removeHost(idSession, otherParticipant.id),
      ).rejects.toThrow(UserUnauthorisedException);
    });
  });

  //closeSessionGroup
  describe('closeSessionGroup', () => {
    it('should close a session group', async () => {
      const idSession = '123456';
      service.createSessionGroup(idSession, host.id, participant);
      service.closeSessionGroup(idSession);
      expect(service.getSession(idSession)).toBeUndefined();
    });
  });

  //getSession
  describe('getSession', () => {
    it('should get a session', async () => {
      const idSession = '123456';
      service.createSessionGroup(idSession, host.id, participant);
      const session = service.getSession(idSession);
      expect(session).toBeDefined();
      expect(session).toBeInstanceOf(ParticipantSessionObject);
    });
  });
});
