import { Injectable } from '@nestjs/common';

@Injectable()
export class SessionService {
  createSession(): string {
    return Math.floor(Math.random()*(1000000-100000)+100000).toString(); // nombre aléatoire de 6 chiffres
  }
}
