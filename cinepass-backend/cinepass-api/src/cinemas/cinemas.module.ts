import { Module } from '@nestjs/common';
import { CinemasController } from './cinemas.controller';
import { CinemasService } from './cinemas.service';

@Module({
  controllers: [CinemasController],
  providers: [CinemasService]
})
export class CinemasModule {}
