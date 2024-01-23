import { Injectable } from '@nestjs/common';
import { BlacklistTokenObject } from '../object/blacklistToken.object';

@Injectable()
export class BlacklistService {
  private readonly blacklist: BlacklistTokenObject[] = [];

  addToBlacklist(token: string) {
    this.blacklist.push(new BlacklistTokenObject(token, Date.now()));
  }

  isTokenBlacklisted(token: string): boolean {
    this.removeOldTokens();
    return this.blacklist.some((blacklistToken) => {
      return (
        blacklistToken.getToken() === token &&
        !this.isNewerThanOneMinute(blacklistToken.getTimestamp())
      );
    });
  }

  isNewerThanOneMinute(timestamp: number): boolean {
    return Date.now() - timestamp < 1000 * 60;
  }

  isOlderThanOneHour(timestamp: number): boolean {
    return Date.now() - timestamp > 1000 * 60 * 60;
  }

  removeOldTokens() {
    this.blacklist.forEach((blacklistToken, index) => {
      if (this.isOlderThanOneHour(blacklistToken.getTimestamp())) {
        this.blacklist.splice(index, 1);
      }
    });
  }
}
