import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UnsupportedCasProtocolException } from '../exception/unsupportedCasProtocol.exception';
import { TicketValidationErrorException } from '../exception/ticketValidationError.exception';

@Injectable()
export class CasService {
  private readonly casProtocol: string;
  private readonly casUrl: string;
  private readonly casValidateServiceRoute: string;

  constructor(private readonly configService: ConfigService) {
    this.casProtocol = configService.getOrThrow('CAS_PROTOCOL');
    this.casUrl = configService.getOrThrow('CAS_URL');
    this.casValidateServiceRoute = configService.getOrThrow(
      'CAS_VALIDATE_SERVICE_ROUTE',
    );
  }

  async validateTicket(service: string, ticket: string) {
    if (this.casProtocol === '3.0')
      await this.validateTicketV3(service, ticket);
    else throw new UnsupportedCasProtocolException();
  }

  async validateTicketV3(service: string, ticket: string) {
    const url =
      this.casUrl +
      this.casValidateServiceRoute +
      '?service=' +
      encodeURIComponent(service) +
      '&ticket=' +
      ticket;
    let response: Response;
    try {
      response = await fetch(url, { method: 'GET' });
    } catch (e) {
      throw new TicketValidationErrorException();
    }
    const xmlDoc = new DOMParser().parseFromString(
      await response.text(),
      'text/xml',
    );
    if (
      !xmlDoc.documentElement.getElementsByTagName('cas:authenticationSuccess')
    )
      throw new TicketValidationErrorException();
    return xmlDoc.documentElement.getElementsByTagName('cas:user')[0]
      .textContent;
  }
}
