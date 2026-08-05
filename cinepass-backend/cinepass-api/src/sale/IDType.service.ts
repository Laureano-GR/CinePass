import { HttpException, Injectable } from '@nestjs/common';
import { IDTypeEntity } from 'src/_entities/IDType.entity';
import { DeepPartial } from "typeorm";

@Injectable()
export class IDTypeService {
  repository = IDTypeEntity;

  async createIDType(idType: DeepPartial<IDTypeEntity>): Promise<IDTypeEntity> {
    try {
      return await this.repository.save(idType);
    } catch (error) {
      throw new HttpException('Create ID type error', 500);
    }
  }

  async findAll() {
    try {
      return await this.repository.find();
    } catch (error) {
      throw new HttpException('Find ID type error', 500);
    }
  }

  async updateIDType(
    idTypeId: number,
    idType: DeepPartial<IDTypeEntity>,
  ): Promise<IDTypeEntity> {
    try {
      const existingIDType = await this.repository.findOne({where:{id:idTypeId}});
      if (!existingIDType) {
        throw new HttpException('ID type not found', 404);
      }
      Object.assign(existingIDType, idType);

      const updatedIDType = await this.repository.save(existingIDType);
      return updatedIDType;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error; 
      }
      throw new HttpException('Update ID type error', 500);
    }
  }

  async findByID(idTypeId: number): Promise<IDTypeEntity> {
    try {
      const idType = await this.repository.findOne({
        where: {
          id: idTypeId,
        }
      });
      
      if (!idType) {
        throw new HttpException('ID type not found', 404);
      }
      
      return idType;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error; 
      }
      throw new HttpException('Find ID type by id error', 500);
    }
  }
}