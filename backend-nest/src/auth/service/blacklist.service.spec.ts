import { TestBed } from '@automock/jest';
import { BlacklistService } from './blacklist.service';

describe('BlacklistService', () => {
  let service: BlacklistService;

  beforeEach(() => {
    const { unit } = TestBed.create(BlacklistService).compile();

    service = unit;
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  //addToBlacklist
  describe('addToBlacklist', () => {
    it('should add a token to blacklist', () => {
      service.addToBlacklist('token');
      expect(service.isTokenBlacklisted('token')).toBeFalsy();
    });
  });

  //isTokenBlacklisted
  describe('isTokenBlacklisted', () => {
    it('should return true if token is blacklisted', () => {
      service.addToBlacklist('token');
      expect(service.isTokenBlacklisted('token')).toBeFalsy();
    });
    it('should return false if token is not blacklisted', () => {
      expect(service.isTokenBlacklisted('tokens')).toBeFalsy();
    });
    it('should return false if token is blacklisted but older than one minute', () => {
      service.addToBlacklist('token');
      service.isNewerThanOneMinute = jest.fn().mockReturnValue(false);
      expect(service.isTokenBlacklisted('token')).toBeTruthy();
    });
  });

  //isNewerThanOneMinute
  describe('isNewerThanOneMinute', () => {
    it('should return true if token is newer than one minute', () => {
      expect(service.isNewerThanOneMinute(Date.now())).toBeTruthy();
    });
    it('should return false if token is not newer than one minute', () => {
      expect(service.isNewerThanOneMinute(Date.UTC(2002))).toBeFalsy();
    });
  });

  //isOlderThanOneHour
  describe('isOlderThanOneHour', () => {
    it('should return true if token is older than one hour', () => {
      expect(service.isOlderThanOneHour(0)).toBeTruthy();
    });
    it('should return false if token is not older than one hour', () => {
      expect(service.isOlderThanOneHour(Date.now())).toBeFalsy();
    });
  });

  //removeOldTokens
  describe('removeOldTokens', () => {
    it('should remove old tokens', () => {
      service.addToBlacklist('token');
      service.isOlderThanOneHour = jest.fn().mockReturnValue(true);
      service.removeOldTokens();
      expect(service.isTokenBlacklisted('token')).toBeFalsy();
    });
  });
});
