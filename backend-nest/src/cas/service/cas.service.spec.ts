import { CasService } from './cas.service';
import { TestBed } from '@automock/jest';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { of } from 'rxjs';
import { TicketValidationErrorException } from '../exception/ticketValidationError.exception';

describe('CasService', () => {
  let service: CasService;
  let httpService: jest.Mocked<HttpService>;
  let mockResponse: AxiosResponse<any> = {
    headers: {},
    config: { headers: null, method: 'GET', url: 'test' },
    status: 200,
    statusText: 'OK',
    data: '<cas:serviceResponse xmlns:cas="http://www.yale.edu/tp/cas"><cas:authenticationSuccess><cas:user>test</cas:user></cas:authenticationSuccess></cas:serviceResponse>',
  };
  beforeAll(() => {
    const { unit, unitRef } = TestBed.create(CasService)
      .mock(ConfigService)
      .using(setupConfigServiceMock())
      .compile();

    httpService = unitRef.get(HttpService);
    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  //validateTicket
  describe('validateTicket', () => {
    it('should be returned a username', async () => {
      httpService.get.mockImplementation(() => of(mockResponse));
      let test = await service.validateTicket(
        'http://test.service.com',
        'test',
      );
      expect(test).toEqual('test');
      expect(httpService.get).toBeCalledWith(
        'https://cas-test.com/validate?service=http%3A%2F%2Ftest.service.com&ticket=test',
      );
    });
    it('should be returned a username', async () => {
      mockResponse.data =
        '<cas:serviceResponse xmlns:cas="http://www.yale.edu/tp/cas"><cas:username>test</cas:username><cas:authenticationSuccess><cas:username>test</cas:username><cas:user>test</cas:user></cas:authenticationSuccess></cas:serviceResponse>';
      httpService.get.mockImplementation(() => of(mockResponse));
      let test = await service.validateTicket(
        'http://test.service.com',
        'test',
      );
      expect(test).toEqual('test');
      expect(httpService.get).toBeCalledWith(
        'https://cas-test.com/validate?service=http%3A%2F%2Ftest.service.com&ticket=test',
      );
    });
    it("should throw an TicketValidationErrorException if can't parse", async () => {
      mockResponse.data =
        '<cas:serviceResponse xmlns:cas="http://www.yale.edu/tp/cas">cas:authenticationSuccess></cas:authenticationSuccess></cas:serviceResponse>';
      httpService.get.mockImplementation(() => of(mockResponse));
      await expect(
        service.validateTicket('http://test.service.com', 'test'),
      ).rejects.toThrow(TicketValidationErrorException);
    });
    it('should throw an CasServerErrorException if can parse but no user', async () => {
      mockResponse.data =
        '<cas:serviceResponse xmlns:cas="http://www.yale.edu/tp/cas"><cas:authenticationSuccess></cas:authenticationSuccess></cas:serviceResponse>';
      httpService.get.mockImplementation(() => of(mockResponse));
      await expect(
        service.validateTicket('http://test.service.com', 'test'),
      ).rejects.toThrow(TicketValidationErrorException);
    });
  });
});

function setupConfigServiceMock() {
  return {
    getOrThrow: jest.fn((key: string) => {
      switch (key) {
        case 'CAS_PROTOCOL':
          return '3.0';
        case 'CAS_URL':
          return 'https://cas-test.com';
        case 'CAS_VALIDATE_SERVICE_ROUTE':
          return '/validate';
        case 'CAS_SUCCESS_XML_TAG':
          return 'cas:authenticationSuccess';
        case 'CAS_USERNAME_XML_TAG':
          return 'cas:user';
        case 'CAS_MAIN_XML_TAG':
          return 'cas:serviceResponse';
        default:
          return null;
      }
    }),
  };
}
