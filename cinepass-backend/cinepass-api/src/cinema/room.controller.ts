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
import { CreateRoomDto } from 'src/_interfaces/createRoom.dto';
import { UpdateRoomDto } from 'src/_interfaces/updateRoom.dto';

@Controller('rooms')
export class RoomController {
  constructor(private service: RoomService) {}
  
    @Post()
    async createRoom(@Body() createRoomDto: CreateRoomDto): Promise<RoomEntity> {
      return await this.service.createRoom(createRoomDto);
    }
  
    @Get()
    async findAll() {
      return await this.service.findAll();
    }
  
    @Put('update/:id')
    async updateRoom(
      @Param('id') id: number,
      @Body() updateRoomDto: UpdateRoomDto,
    ): Promise<RoomEntity> {
      return await this.service.updateRoom(id, updateRoomDto);
    }
    
    @Get(':id')
    async findByID(@Param('id') id: number): Promise<RoomEntity> {
      return await this.service.findByID(id);
    }
}