import { HttpException, Injectable } from '@nestjs/common';
import { RoomEntity } from 'src/_entities/room.entity';
import { DeepPartial } from "typeorm";

@Injectable()
export class RoomService {
  repository = RoomEntity;
  
  async createRoom(room: DeepPartial<RoomEntity>): Promise<RoomEntity> {
    try {
      return await this.repository.save(room);
    } catch (error) {
      throw new HttpException('Create room error', 500);
    }
  }

  async findAll() {
    try {
      return await this.repository.find();
    } catch (error) {
      throw new HttpException('Find rooms error', 500);
    }
  }

  async updateRoom(
    roomId: number,
    room: DeepPartial<RoomEntity>,
  ): Promise<RoomEntity> {
    try {
      const existingRoom = await this.repository.findOne({where:{id:roomId}});
      if (!existingRoom) {
        throw new HttpException('Room not found', 404);
      }
      Object.assign(existingRoom, room);

      const updatedRoom = await this.repository.save(existingRoom);
      return updatedRoom;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error; 
      }
      throw new HttpException('Update room error', 500);
    }
  }

  async findByID(roomId: number): Promise<RoomEntity> {
    try {
      const room = await this.repository.findOne({
        where: {
          id: roomId,
        }
      });
      
      if (!room) {
        throw new HttpException('Room not found', 404);
      }
      
      return room;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error; 
      }
      throw new HttpException('Find room by id error', 500);
    }
  }
}