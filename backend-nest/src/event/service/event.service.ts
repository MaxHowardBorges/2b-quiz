import { Injectable } from '@nestjs/common';
import { EventParticipantEnum } from '../enum/eventParticipant.enum';
import { Subject } from 'rxjs';
import { SessionNotFoundException } from '../exception/sessionNotFound.exception';
import { UserUnauthorisedException } from '../exception/userUnauthorised.exception';
import { ParticipantInterface } from '../../user/interface/participant.interface';
import { ParticipantSessionObject } from '../object/participantSession.object';
import { EventHostEnum } from '../enum/eventHost.enum';

@Injectable()
export class EventService {
  constructor() {}

  private sessionMap: Map<string, ParticipantSessionObject> = new Map<
    string,
    ParticipantSessionObject
  >();

  sendEvent(event: EventParticipantEnum, idSession: string): void {
    if (this.sessionMap.get(idSession)) {
      this.sessionMap
        .get(idSession)
        .getParticipantSubjectList()
        .forEach((subject) => {
          subject.next(event);
        });
      this.sessionMap.get(idSession).getObserverSubject().next(event);
    }
  }

  sendHostEventWithPayload(
    event: EventHostEnum,
    idSession: string,
    payload: any,
  ): void {
    if (this.sessionMap.get(idSession)) {
      this.sessionMap
        .get(idSession)
        .getHostSubject()
        .next(JSON.stringify({ event, payload: payload }));
    }
  }

  async createClient(
    idSession: string,
    idUser: number,
  ): Promise<Subject<string>> {
    if (!this.sessionMap.get(idSession)) throw new SessionNotFoundException();
    const studentSession = this.sessionMap.get(idSession);
    if (
      studentSession.isPrivateSession() &&
      !studentSession.checkIdParticipant(idUser)
    )
      throw new UserUnauthorisedException();
    return studentSession.getParticipants(idUser).getSubject();
  }

  async removeClient(idSession: string, idUser: number): Promise<void> {
    if (this.sessionMap.get(idSession)) {
      if (this.sessionMap.get(idSession).checkIdParticipant(idUser))
        this.sessionMap.get(idSession).removeParticipant(idUser);
    }
  }

  async createObserver(
    idSession: string,
    idUser: number,
  ): Promise<Subject<string>> {
    if (!this.sessionMap.get(idSession)) throw new SessionNotFoundException();
    const observerSession = this.sessionMap.get(idSession);
    if (!observerSession.checkIdHost(idUser))
      throw new UserUnauthorisedException();
    return observerSession.getObserverSubject();
  }

  async removeObserver(idSession: string, idHost: number): Promise<void> {
    const observerSession = this.sessionMap.get(idSession);
    if (observerSession) {
      if (observerSession.checkIdHost(idHost))
        observerSession.resetObserverSubject();
    }
  }

  async createHost(
    idSession: string,
    idUser: number,
  ): Promise<Subject<string>> {
    if (!this.sessionMap.get(idSession)) throw new SessionNotFoundException();
    const hostSession = this.sessionMap.get(idSession);
    if (!hostSession.checkIdHost(idUser)) throw new UserUnauthorisedException();
    return hostSession.getHostSubject();
  }

  async removeHost(idSession: string, idHost: number): Promise<void> {
    const hostSession = this.sessionMap.get(idSession);
    if (hostSession) {
      if (hostSession.checkIdHost(idHost)) hostSession.resetHostSubject();
    }
  }

  createSessionGroup(
    idSession: string,
    idHost: number,
    participantInterfaces?: ParticipantInterface[],
  ) {
    const participantSessionObject = new ParticipantSessionObject(
      idSession,
      idHost,
      participantInterfaces,
    );
    this.sessionMap.set(idSession, participantSessionObject);
  }
  closeSessionGroup(idSession: string) {
    this.sessionMap.delete(idSession);
  }

  getSession(idSession: string) {
    return this.sessionMap.get(idSession);
  }
}
