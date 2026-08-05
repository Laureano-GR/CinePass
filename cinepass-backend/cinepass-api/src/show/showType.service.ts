import { HttpException, Injectable } from '@nestjs/common';
import { ShowTypeEntity } from 'src/_entities/showType.entity';
import { DeepPartial } from "typeorm";

@Injectable()
export class ShowTypeService {
  repository = ShowTypeEntity;
  
  async createShowType(showType: DeepPartial<ShowTypeEntity>): Promise<ShowTypeEntity> {
    try {
      return await this.repository.save(showType);
    } catch (error) {
      throw new HttpException('Create show type error', 500);
    }
  }

  async findAll() {
    try {
      return await this.repository.find();
    } catch (error) {
      throw new HttpException('Find show types error', 500);
    }
  }

  async updateShowType(
    showTypeId: number,
    showType: DeepPartial<ShowTypeEntity>,
  ): Promise<ShowTypeEntity> {
    try {
      const existingShowType = await this.repository.findOne({where:{id:showTypeId}});
      if (!existingShowType) {
        throw new HttpException('Show type not found', 404);
      }
      Object.assign(existingShowType, showType);

      const updatedShowType = await this.repository.save(existingShowType);
      return updatedShowType;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error; 
      }
      throw new HttpException('Update show type error', 500);
    }
  }

  async findByID(showTypeId: number): Promise<ShowTypeEntity> {
    try {
      const showType = await this.repository.findOne({
        where: {
          id: showTypeId,
        }
      });
      
      if (!showType) {
        throw new HttpException('show type not found', 404);
      }
      
      return showType;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error; 
      }
      throw new HttpException('Find show type by id error', 500);
    }
  }
}