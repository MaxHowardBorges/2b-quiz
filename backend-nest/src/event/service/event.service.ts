import { Injectable } from '@nestjs/common';
import { EventEnum } from '../enum/event.enum';
import { Subject } from 'rxjs';
import { SessionNotFoundException } from '../exception/sessionNotFound.exception';
import { UserUnauthorisedException } from '../exception/userUnauthorised.exception';
import { ParticipantInterface } from '../../user/interface/participant.interface';
import { ParticipantSessionObject } from '../object/participantSession.object';

@Injectable()
export class EventService {
  constructor() {}

  private sessionMap: Map<string, ParticipantSessionObject> = new Map<
    string,
    ParticipantSessionObject
  >();

  sendEvent(event: EventEnum, idSession: string): void {
    if (this.sessionMap.get(idSession)) {
      this.sessionMap
        .get(idSession)
        .getParticipantSubjectList()
        .forEach((subject) => {
          subject.next(event);
        });
    }
  }

  createClient(idSession: string, idUser: number): Subject<string> {
    if (!this.sessionMap.get(idSession)) throw new SessionNotFoundException();
    const studentSession = this.sessionMap.get(idSession);
    if (
      studentSession.isPrivateSession() &&
      !studentSession.checkIdParticipant(idUser)
    )
      throw new UserUnauthorisedException();
    return studentSession.getParticipants(idUser).getSubject();
  }

  removeClient(idSession: string, idUser: number): void {
    if (this.sessionMap.get(idSession)) {
      if (!this.sessionMap.get(idSession).checkIdParticipant(idUser))
        throw new UserUnauthorisedException();
      this.sessionMap.get(idSession).removeParticipant(idUser);
    }
  }

  createObserver(idSession: string, idUser: number): Subject<string> {
    if (!this.sessionMap.get(idSession)) throw new SessionNotFoundException();
    const observerSession = this.sessionMap.get(idSession);
    if (!observerSession.checkIdHost(idUser))
      throw new UserUnauthorisedException();
    return observerSession.getObserverSubject();
  }

  removeObserver(idSession: string): void {
    const observerSession = this.sessionMap.get(idSession);
    if (observerSession) {
      observerSession.resetObserverSubject();
    }
  }

  createHost(idSession: string, idUser: number): Subject<string> {
    if (!this.sessionMap.get(idSession)) throw new SessionNotFoundException();
    const hostSession = this.sessionMap.get(idSession);
    if (!hostSession.checkIdHost(idUser)) throw new UserUnauthorisedException();
    return hostSession.getHostSubject();
  }

  removeHost(idSession: string): void {
    const hostSession = this.sessionMap.get(idSession);
    if (hostSession) {
      hostSession.resetHostSubject();
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
}
