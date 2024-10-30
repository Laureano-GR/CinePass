import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomEntity } from 'src/_entities/room.entity';
import { ShowTypeEntity } from 'src/_entities/showType.entity';
import { SubsidiaryEntity } from 'src/_entities/subsidiary.entity';
import { DeepPartial, Repository } from "typeorm";
import { CreateRoomDto } from 'src/_interfaces/createRoom.dto';
import { UpdateRoomDto } from 'src/_interfaces/updateRoom.dto';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(RoomEntity)
    private roomRepository: Repository<RoomEntity>,
    @InjectRepository(SubsidiaryEntity)
    private subsidiaryRepository: Repository<SubsidiaryEntity>,
    @InjectRepository(ShowTypeEntity)
    private showTypeRepository: Repository<ShowTypeEntity>,
  ) {}
  
  async createRoom(createRoomDto: CreateRoomDto): Promise<RoomEntity> {
    try {
      // Cargar la sucursal y los tipos de show usando los IDs del DTO
      const subsidiary = await this.subsidiaryRepository.findOne({
        where: { id: createRoomDto.subsidiaryId },
      });
      const showTypes = await this.showTypeRepository.findByIds(createRoomDto.showTypeIds);
  
      // Verificar que los datos existan
      if (!subsidiary || !showTypes.length) {
        throw new HttpException('Invalid subsidiary or show types', 400);
      }
  
      // Crear una nueva sala asignando las relaciones
      const newRoom = this.roomRepository.create({
        roomNumber: createRoomDto.roomNumber,
        capacity: createRoomDto.capacity,
        subsidiary: subsidiary,
        showTypes: showTypes,
      });
  
      // Guardar la sala
      return await this.roomRepository.save(newRoom);
    } catch (error) {
      console.error('Create room error:', error); // Mensaje detallado en consola para depuración
      throw new HttpException('Create room error', 500);
    }
  }
  

  async findAll() {
    try {
      return await this.roomRepository.find({
        relations:['subsidiary','showTypes'],
      });
    } catch (error) {
      throw new HttpException('Find rooms error', 500);
    }
  }

  async updateRoom(roomId: number, updateRoomDto: UpdateRoomDto): Promise<RoomEntity> {
    try {
      const room = await this.roomRepository.findOne({ where: { id: roomId } });

      if (!room) {
        throw new HttpException('Room not found', 404);
      }

      if (updateRoomDto.roomNumber !== undefined) {
        room.roomNumber = updateRoomDto.roomNumber;
      }
      if (updateRoomDto.capacity !== undefined) {
        room.capacity = updateRoomDto.capacity;
      }
      if (updateRoomDto.subsidiaryId !== undefined) {
        room.subsidiary = await this.subsidiaryRepository.findOne({
          where: { id: updateRoomDto.subsidiaryId },
        });
      }
      if (updateRoomDto.showTypeIds !== undefined) {
        room.showTypes = await this.showTypeRepository.findByIds(updateRoomDto.showTypeIds);
      }

      return await this.roomRepository.save(room);
    } catch (error) {
      throw new HttpException('Update room error', 500);
    }
  }

  async findByID(roomId: number): Promise<RoomEntity> {
    try {
      const room = await this.roomRepository.findOne({
        where: {
          id: roomId,
        },
        relations:['subsidiary','showTypes']
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