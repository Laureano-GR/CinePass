import { Module } from '@nestjs/common';
import { CinemaController } from './cinema.controller';
import { CinemaService } from './cinema.service';
import { AddressController } from './address.controller';
import { CityController } from './city.controller';
import { RoomController } from './room.controller';
import { SubsidiaryController } from './subsidiary.controller';
import { AddressService } from './address.service';
import { CityService } from './city.service';
import { RoomService } from './room.service';
import { SubsidiaryService } from './subsidiary.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomEntity } from 'src/_entities/room.entity';
import { SubsidiaryEntity } from 'src/_entities/subsidiary.entity';
import { ShowTypeEntity } from 'src/_entities/showType.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([RoomEntity, SubsidiaryEntity, ShowTypeEntity]),
  ],
  controllers: [CinemaController, AddressController, CityController, RoomController, SubsidiaryController],
  providers: [CinemaService, AddressService, CityService, RoomService, SubsidiaryService]
})
export class CinemaModule {}
