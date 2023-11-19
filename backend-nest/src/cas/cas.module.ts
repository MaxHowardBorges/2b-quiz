import { Module } from '@nestjs/common';
import { CasService } from './service/cas.service';

@Module({
  providers: [CasService],
  exports: [CasService],
})
export class CasModule {}
