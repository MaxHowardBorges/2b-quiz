import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../user/service/user.service';
import { Reflector } from '@nestjs/core';
import { BlacklistService } from '../service/blacklist.service';
import { AuthGuard } from './auth.guard';
import { TestBed } from '@automock/jest';
import { Teacher } from '../../user/entity/teacher.entity';
import {
  generateStudentMock,
  generateTeacherMock,
} from '../../../test/mock/user.mock';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { UserType } from '../../user/constants/userType.constant';
import { Student } from '../../user/entity/student.entity';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let jwtService: jest.Mocked<JwtService>;
  let configService: jest.Mocked<ConfigService>;
  let userService: jest.Mocked<UserService>;
  let reflector: jest.Mocked<Reflector>;
  let blacklistService: jest.Mocked<BlacklistService>;
  let teacherMock: Teacher;
  let studentMock: Student;
  let mockExecutionContext: ExecutionContext;

  beforeAll(() => {
    const { unit, unitRef } = TestBed.create(AuthGuard).compile();

    guard = unit;
    jwtService = unitRef.get(JwtService);
    configService = unitRef.get(ConfigService);
    userService = unitRef.get(UserService);
    reflector = unitRef.get(Reflector);
    blacklistService = unitRef.get(BlacklistService);
  });

  beforeEach(() => {
    teacherMock = generateTeacherMock();
    studentMock = generateStudentMock(false, false);
    mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnThis(),
      getRequest: jest.fn().mockReturnValue({
        query: {},
        headers: {
          authorization: 'Bearer token',
        },
      }),
      getHandler: jest.fn().mockReturnValue({}),
      getClass: jest.fn().mockReturnValue({}),
    } as any;
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
    expect(jwtService).toBeDefined();
    expect(configService).toBeDefined();
    expect(userService).toBeDefined();
    expect(reflector).toBeDefined();
    expect(blacklistService).toBeDefined();
  });

  //canActivate
  describe('canActivate', () => {
    it('should return true if isPublic is true', async () => {
      reflector.getAllAndOverride.mockReturnValueOnce(true);
      expect(await guard.canActivate(mockExecutionContext)).toBeTruthy();
    });
    it('should return true if token is not blacklisted', async () => {
      reflector.getAllAndOverride.mockReturnValueOnce(false);
      blacklistService.isTokenBlacklisted.mockReturnValueOnce(false);
      jwtService.verifyAsync.mockResolvedValueOnce({ id: 1 });
      const user = teacherMock;
      userService.getUser.mockResolvedValueOnce(user);
      expect(await guard.canActivate(mockExecutionContext)).toBeTruthy();
    });
    it('should throw new UnauthorizedException if token is blacklisted', async () => {
      reflector.getAllAndOverride.mockReturnValueOnce(false);
      blacklistService.isTokenBlacklisted.mockReturnValueOnce(true);
      await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
        UnauthorizedException,
      );
    });
    it('should throw new UnauthorizedException if token is not valid', async () => {
      reflector.getAllAndOverride.mockReturnValueOnce(false);
      blacklistService.isTokenBlacklisted.mockReturnValueOnce(false);
      jwtService.verifyAsync.mockRejectedValueOnce(null);
      await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
        UnauthorizedException,
      );
    });
    it('should return false if user is deleted', async () => {
      reflector.getAllAndOverride.mockReturnValueOnce(false);
      blacklistService.isTokenBlacklisted.mockReturnValueOnce(false);
      jwtService.verifyAsync.mockResolvedValueOnce({ id: 1 });
      const user = teacherMock;
      user.deleted = true;
      userService.getUser.mockResolvedValueOnce(user);
      expect(await guard.canActivate(mockExecutionContext)).toBeFalsy();
    });
    it('should return true if user is not deleted', async () => {
      const user = teacherMock;
      reflector.getAllAndOverride.mockReturnValueOnce(false);
      blacklistService.isTokenBlacklisted.mockReturnValueOnce(false);
      jwtService.verifyAsync.mockResolvedValueOnce({ id: 1 });
      userService.getUser.mockResolvedValueOnce(user);
      expect(await guard.canActivate(mockExecutionContext)).toBeTruthy();
    });
    it('should throw new UnauthorizedException if user is not authorised', async () => {
      reflector.getAllAndOverride.mockReturnValueOnce(false);
      blacklistService.isTokenBlacklisted.mockReturnValueOnce(false);
      jwtService.verifyAsync.mockResolvedValueOnce({ id: 1 });
      userService.getUser.mockResolvedValueOnce(teacherMock);
      reflector.get.mockReturnValueOnce(['student']);
      await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
        UnauthorizedException,
      );
    });
    it('should return true if user is authorised', async () => {
      reflector.getAllAndOverride.mockReturnValueOnce(false);
      blacklistService.isTokenBlacklisted.mockReturnValueOnce(false);
      jwtService.verifyAsync.mockResolvedValueOnce({ id: 1 });
      userService.getUser.mockResolvedValueOnce(teacherMock);
      reflector.get.mockReturnValueOnce(['teacher']);
      expect(await guard.canActivate(mockExecutionContext)).toBeTruthy();
    });
    it('should throw new UnauthorizedException if user is NOT_CHOOSE', async () => {
      const user = studentMock;
      reflector.getAllAndOverride.mockReturnValueOnce(false);
      blacklistService.isTokenBlacklisted.mockReturnValueOnce(false);
      jwtService.verifyAsync.mockResolvedValueOnce({ id: 1 });
      userService.getUser.mockResolvedValueOnce(user);
      reflector.get.mockReturnValueOnce(false);
      await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
        UnauthorizedException,
      );
    });
    it('should return true if user isHeaderless', async () => {
      mockExecutionContext.switchToHttp().getRequest().headers = {};
      mockExecutionContext.switchToHttp().getRequest().query = {
        token: 'token',
      };
      reflector.getAllAndOverride.mockReturnValueOnce(false);
      reflector.getAllAndOverride.mockReturnValueOnce(true);
      blacklistService.isTokenBlacklisted.mockReturnValueOnce(false);
      jwtService.verifyAsync.mockResolvedValueOnce({ id: 1 });
      userService.getUser.mockResolvedValueOnce(teacherMock);
      reflector.get.mockReturnValueOnce(false);
      expect(await guard.canActivate(mockExecutionContext)).toBeTruthy();
    });
  });

  //extractTokenFromHeader
  describe('extractTokenFromHeader', () => {
    it('should return token', () => {
      const request = mockExecutionContext.switchToHttp().getRequest();
      expect(guard['extractTokenFromHeader'](request)).toEqual('token');
    });
    it('should return undefined', () => {
      const request = mockExecutionContext.switchToHttp().getRequest();
      request.headers = {};
      expect(guard['extractTokenFromHeader'](request)).toBeUndefined();
    });
  });

  //matchRoles
  describe('matchRoles', () => {
    it('should return true if roles contains role', () => {
      expect(
        guard['matchRoles']([UserType.TEACHER], UserType.TEACHER),
      ).toBeTruthy();
    });
    it('should return false if roles not contains role', () => {
      expect(
        guard['matchRoles']([UserType.TEACHER], UserType.STUDENT),
      ).toBeFalsy();
    });
  });
});
