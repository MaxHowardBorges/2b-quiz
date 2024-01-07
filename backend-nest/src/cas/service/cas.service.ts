import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UnsupportedCasProtocolException } from '../exception/unsupportedCasProtocol.exception';
import { TicketValidationErrorException } from '../exception/ticketValidationError.exception';
import { CasServerErrorException } from '../exception/casServerError.exception';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom, map } from 'rxjs';
import { AxiosError } from 'axios';
import { parseStringPromise } from 'xml2js';

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

  async validateTicket(service: string, ticket: string): Promise<String> {
    if (this.casProtocol === '3.0')
      return await this.validateTicketV3(service, ticket);
    else throw new UnsupportedCasProtocolException();
  }

  private async validateTicketV3(
    service: string,
    ticket: string,
  ): Promise<string> {
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
          console.error(error);
          throw new CasServerErrorException();
        }),
      ),
    );
    let xml: any;
    try {
      xml = await parseStringPromise(response);
    } catch (err) {
      throw new TicketValidationErrorException();
    }
    if (
      !xml[this.casMainXmlTag] ||
      !xml[this.casMainXmlTag][this.casSuccessXmlTag] ||
      !this.containsKey(
        this.casUsernameXmlTag,
        xml[this.casMainXmlTag][this.casSuccessXmlTag],
      )
    )
      throw new TicketValidationErrorException();

    const usernameTagIndex = this.getTagIndexInList(
      this.casUsernameXmlTag,
      xml[this.casMainXmlTag][this.casSuccessXmlTag],
    );
    if (
      !xml[this.casMainXmlTag][this.casSuccessXmlTag][usernameTagIndex][
        this.casUsernameXmlTag
      ] ||
      !xml[this.casMainXmlTag][this.casSuccessXmlTag][usernameTagIndex][
        this.casUsernameXmlTag
      ][0]
    )
      throw new TicketValidationErrorException();
    return xml[this.casMainXmlTag][this.casSuccessXmlTag][usernameTagIndex][
      this.casUsernameXmlTag
    ][0];
  }

  private getTagIndexInList(tag: string, xml: any[]) {
    for (let i = 0; i < xml.length; i++) {
      if (!!xml[i][tag]) return i;
    }
    return -1;
  }

  private containsKey(key: string, xml: any) {
    for (let i = 0; i < xml.length; i++) {
      if (!!xml[i][key]) return true;
    }
    return false;
  }
}
