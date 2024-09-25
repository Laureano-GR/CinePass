import { Module } from '@nestjs/common';
import { ShowsController } from './shows.controller';
import { ShowsService } from './shows.service';
import { ShowTypeController } from './showType.controller';

@Module({
  controllers: [ShowsController, ShowTypeController],
  providers: [ShowsService, ShowsService]
})
export class ShowsModule {}
