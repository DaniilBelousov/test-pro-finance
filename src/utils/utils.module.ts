import { Module } from '@nestjs/common';
import { UtilsCryptoService } from './utils-crypto.service';

@Module({
  providers: [UtilsCryptoService],
})
export class UtilsModule {}
