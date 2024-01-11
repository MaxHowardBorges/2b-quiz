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
      const idSession2 = '123456';
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
});
