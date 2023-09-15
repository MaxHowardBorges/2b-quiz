import { Injectable } from '@nestjs/common';

@Injectable()
export class SessionService {
  createSession(): string {
    return Math.random().toString();
  }
}
