import { Module } from '@nestjs/common';
import { ShowController } from './show.controller';
import { ShowService } from './show.service';
import { ShowTypeController } from './showType.controller';
import { ShowTypeService } from './showType.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubsidiaryEntity } from 'src/_entities/subsidiary.entity';
import { RoomEntity } from 'src/_entities/room.entity';
import { MovieEntity } from 'src/_entities/movie.entity';
import { LanguageEntity } from 'src/_entities/language.entity';
import { ShowEntity } from 'src/_entities/show.entity';
import { ShowTypeEntity } from 'src/_entities/showType.entity';
import { TicketService } from 'src/sale/ticket.service';

@Module({
  imports: [TypeOrmModule.forFeature([MovieEntity, LanguageEntity, RoomEntity, SubsidiaryEntity, ShowEntity, ShowTypeEntity])],
  controllers: [ShowController, ShowTypeController],
  providers: [ShowService, ShowTypeService, TicketService]
})
export class ShowModule {}
