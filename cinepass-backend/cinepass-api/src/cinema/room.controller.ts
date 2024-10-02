import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
} from '@nestjs/common';
import { RoomEntity } from 'src/_entities/room.entity';
import { DeepPartial } from "typeorm";
import { RoomService } from './room.service';

@Controller('rooms')
export class RoomController {
  constructor(private service: RoomService) {}
  
    @Post()
    async createRoom(
      @Body() room: DeepPartial<RoomEntity>,
    ): Promise<RoomEntity> {
      return await this.service.createRoom(room);
    }
  
    @Get()
    async findAll() {
      return await this.service.findAll();
    }
  
    @Put('update/:id')
    async updateRoom(
      @Param('id') id: number,
      @Body() room: DeepPartial<RoomEntity>,
    ): Promise<RoomEntity> {
      const updatedRoom = await this.service.updateRoom(id, room);
      return updatedRoom;
    }
    
    @Get(':id')
    async findByID(@Param('id') id: number): Promise<RoomEntity> {
      return await this.service.findByID(id);
    }
}