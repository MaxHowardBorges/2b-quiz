import { Module } from '@nestjs/common';
import { CasService } from './service/cas.service';
import { HttpModule } from '@nestjs/axios';
import * as https from 'https';

@Module({
  imports: [
    HttpModule.register({
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
    }),
  ],
  providers: [CasService],
  exports: [CasService],
})
export class CasModule {}
