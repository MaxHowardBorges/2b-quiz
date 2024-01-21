export class BlacklistTokenObject {
  private readonly token: string;
  private readonly timestamp: number;

  constructor(token: string, timestamp: number) {
    this.token = token;
    this.timestamp = timestamp;
  }

  getToken(): string {
    return this.token;
  }

  getTimestamp(): number {
    return this.timestamp;
  }
}
