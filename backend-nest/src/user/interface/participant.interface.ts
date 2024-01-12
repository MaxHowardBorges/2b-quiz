export interface ParticipantInterface {
  id: number;
  username: string;
  equals(user: ParticipantInterface): boolean;
}
