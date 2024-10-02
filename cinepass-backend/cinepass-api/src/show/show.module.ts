import { Module } from '@nestjs/common';
import { ShowController } from './show.controller';
import { ShowService } from './show.service';
import { ShowTypeController } from './showType.controller';
import { ShowTypeService } from './showType.service';

@Module({
  controllers: [ShowController, ShowTypeController],
  providers: [ShowService, ShowTypeService]
})
export class ShowModule {}
