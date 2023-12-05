import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UnsupportedCasProtocolException } from '../exception/unsupportedCasProtocol.exception';
import { TicketValidationErrorException } from '../exception/ticketValidationError.exception';
import { CasServerErrorException } from '../exception/casServerError.exception';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom, map } from 'rxjs';
import { AxiosError } from 'axios';
import { parseString } from 'xml2js';

@Injectable()
export class CasService {
  private readonly casProtocol: string;
  private readonly casUrl: string;
  private readonly casValidateServiceRoute: string;
  private readonly casMainXmlTag: string;
  private readonly casSuccessXmlTag: string;
  private readonly casUsernameXmlTag: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.casProtocol = this.configService.getOrThrow('CAS_PROTOCOL');
    this.casUrl = this.configService.getOrThrow('CAS_URL');
    this.casValidateServiceRoute = this.configService.getOrThrow(
      'CAS_VALIDATE_SERVICE_ROUTE',
    );
    this.casSuccessXmlTag = this.configService.getOrThrow(
      'CAS_SUCCESS_XML_TAG',
    );
    this.casUsernameXmlTag = this.configService.getOrThrow(
      'CAS_USERNAME_XML_TAG',
    );
    this.casMainXmlTag = this.configService.getOrThrow('CAS_MAIN_XML_TAG');
  }

  async validateTicket(service: string, ticket: string) {
    if (this.casProtocol === '3.0')
      return await this.validateTicketV3(service, ticket);
    else throw new UnsupportedCasProtocolException();
  }

  private async validateTicketV3(service: string, ticket: string) {
    const url =
      this.casUrl +
      this.casValidateServiceRoute +
      '?service=' +
      encodeURIComponent(service) +
      '&ticket=' +
      ticket;
    const response = await firstValueFrom(
      this.httpService.get<string>(url).pipe(
        map((response) => response.data),
        catchError((error: AxiosError) => {
          console.log(error);
          throw new CasServerErrorException();
        }),
      ),
    );
    let xml: any;
    parseString(response, function (err, result) {
      if (err) throw new TicketValidationErrorException();
      xml = result;
    });
    if (
      !xml[this.casMainXmlTag][this.casSuccessXmlTag] ||
      !xml[this.casMainXmlTag][this.casSuccessXmlTag][0][
        this.casUsernameXmlTag
      ][0]
    )
      throw new TicketValidationErrorException();

    return xml[this.casMainXmlTag][this.casSuccessXmlTag][0][
      this.casUsernameXmlTag
    ][0];
  }
}
