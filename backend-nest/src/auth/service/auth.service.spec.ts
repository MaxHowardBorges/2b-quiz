import { AuthService } from './auth.service';
import { TestBed } from '@automock/jest';
import { UserService } from '../../user/service/user.service';
import { JwtService } from '@nestjs/jwt';
import { CasService } from '../../cas/service/cas.service';
import { generateTeacherMock } from '../../../test/mock/user.mock';
import { Teacher } from '../../user/entity/teacher.entity';
import { TicketValidationErrorException } from '../../cas/exception/ticketValidationError.exception';
import { InvalidTicketException } from '../exception/invalidTicket.exception';
import { UserNotFoundException } from '../exception/userNotFound.exception';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: jest.Mocked<JwtService>;
  let userService: jest.Mocked<UserService>;
  let casService: jest.Mocked<CasService>;
  let mockTeacher: Teacher = generateTeacherMock();

  beforeAll(() => {
    const { unit, unitRef } = TestBed.create(AuthService).compile();

    service = unit;
    jwtService = unitRef.get(JwtService);
    userService = unitRef.get(UserService);
    casService = unitRef.get(CasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  //signIn
  describe('signIn', () => {
    it('should be returned a token', async () => {
      casService.validateTicket.mockResolvedValue(mockTeacher.username);
      userService.getUserForLogin.mockResolvedValue(mockTeacher);
      jwtService.signAsync.mockResolvedValue('token');
      const test = await service.signIn('ticket', 'service');
      expect(test).toEqual({ access_token: 'token' });
      expect(casService.validateTicket).toBeCalledWith('service', 'ticket');
      expect(userService.getUserForLogin).toBeCalledWith(mockTeacher.username);
      expect(jwtService.signAsync).toBeCalledWith({
        id: mockTeacher.id,
        username: mockTeacher.username,
      });
    });
    it('should throw an InvalidTicketException if casService throw an TicketValidationErrorException', async () => {
      casService.validateTicket.mockRejectedValue(
        new TicketValidationErrorException(),
      );
      await expect(service.signIn('ticket', 'service')).rejects.toThrow(
        InvalidTicketException,
      );
    });
    it('should throw a CasUnavailableException if casService throw an UnsupportedCasProtocolException', async () => {
      casService.validateTicket.mockRejectedValue(
        new TicketValidationErrorException(),
      );
      await expect(service.signIn('ticket', 'service')).rejects.toThrow(
        InvalidTicketException,
      );
    });
  });

  //renewToken
  describe('renewToken', () => {
    it('should be returned a token', async () => {
      jwtService.signAsync.mockResolvedValue('token');
      userService.getUserByUsername.mockResolvedValue(mockTeacher);
      const test = await service.renewToken(mockTeacher);
      expect(test).toEqual('token');
      expect(jwtService.signAsync).toBeCalledWith({
        id: mockTeacher.id,
        username: mockTeacher.username,
      });
    });
    it('should throw an UserNotFoundException if userService throw an UserNotFoundException', async () => {
      userService.getUserByUsername.mockResolvedValue(null);
      await expect(service.renewToken(mockTeacher)).rejects.toThrow(
        UserNotFoundException,
      );
    });
  });

  describe('signInDev', () => {
    it('should be returned a token', async () => {
      jwtService.signAsync.mockResolvedValue('token');
      userService.getUserForLogin.mockResolvedValue(mockTeacher);
      const test = await service.signInDev(mockTeacher.username);
      expect(test).toEqual({ access_token: 'token' });
      expect(userService.getUserForLogin).toBeCalledWith(mockTeacher.username);
      expect(jwtService.signAsync).toBeCalledWith({
        id: mockTeacher.id,
        username: mockTeacher.username,
      });
    });
  });
});
