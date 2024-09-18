import { Module } from '@nestjs/common';
import { ShowsController } from './shows.controller';
import { ShowsService } from './shows.service';

@Module({
  controllers: [ShowsController],
  providers: [ShowsService]
})
export class ShowsModule {}
