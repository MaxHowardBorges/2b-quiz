import { ParticipantEventListenerObject } from './participantEventListener.object';
import { Subject } from 'rxjs';
import { ParticipantInterface } from '../../user/interface/participant.interface';

export class ParticipantSessionObject {
  protected idSession: string;
  protected isPrivate: boolean;
  protected idHost: number;
  protected participants: Array<ParticipantEventListenerObject>;
  protected hostSubject: Subject<string>;
  protected observerSubject: Subject<string>;

  constructor(
    idSession: string,
    idHost: number,
    participantList?: ParticipantInterface[],
  ) {
    this.idSession = idSession;
    this.isPrivate = !!participantList;
    this.idHost = idHost;
    this.participants = [];
    if (participantList) {
      for (const participant of participantList) {
        this.participants.push(
          new ParticipantEventListenerObject(participant.id),
        );
      }
    }
    this.hostSubject = new Subject<string>();
    this.observerSubject = new Subject<string>();
  }

  checkIdHost(idHost: number): boolean {
    return this.idHost === idHost;
  }

  getHostSubject(): Subject<string> {
    return this.hostSubject;
  }

  getObserverSubject(): Subject<string> {
    return this.observerSubject;
  }

  checkIdParticipant(idParticipant: number): boolean {
    return this.participants.some((participant) => {
      return participant.checkId(idParticipant);
    });
  }

  getParticipants(idUser: number): ParticipantEventListenerObject {
    if (this.isPrivate) {
      return this.participants.find((participant) => {
        return participant.checkId(idUser);
      });
    } else {
      const participant = new ParticipantEventListenerObject(idUser);
      this.participants.push(participant);
      return participant;
    }
  }

  getParticipantSubjectList(): Subject<string>[] {
    return this.participants.map((participant) => {
      return participant.getSubject();
    });
  }

  isPrivateSession(): boolean {
    return this.isPrivate;
  }

  removeParticipant(idParticipant: number): void {
    if (this.isPrivate) {
      const participant = this.participants.find((participant) => {
        return participant.checkId(idParticipant);
      });
      participant.resetSubject();
    } else {
      //remove participant from participants
      this.participants = this.participants.filter((participant) => {
        return !participant.checkId(idParticipant);
      });
    }
  }

  resetObserverSubject() {
    this.observerSubject = new Subject<string>();
  }

  resetHostSubject() {
    this.hostSubject = new Subject<string>();
  }
}
