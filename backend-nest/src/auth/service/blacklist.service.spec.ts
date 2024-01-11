import { TestBed } from '@automock/jest';
import { BlacklistService } from './blacklist.service';

describe('BlacklistService', () => {
  let service: BlacklistService;

  beforeAll(() => {
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
      expect(service.isTokenBlacklisted('token')).toBeTruthy();
    });
  });

  //isTokenBlacklisted
  describe('isTokenBlacklisted', () => {
    it('should return true if token is blacklisted', () => {
      service.addToBlacklist('token');
      expect(service.isTokenBlacklisted('token')).toBeTruthy();
    });
    it('should return false if token is not blacklisted', () => {
      expect(service.isTokenBlacklisted('tokens')).toBeFalsy();
    });
  });
});
