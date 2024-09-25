import { Module } from '@nestjs/common';
import { CinemasController } from './cinema.controller';
import { CinemasService } from './cinemas.service';
@Module({
  controllers: [CinemasController],
  providers: [CinemasService]
})
export class CinemasModule {}
