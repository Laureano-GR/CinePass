import { HttpException, Injectable } from '@nestjs/common';
import { SubsidiaryEntity } from 'src/_entities/subsidiary.entity';
import { DeepPartial } from "typeorm";

@Injectable()
export class SubsidiaryService {
  repository = SubsidiaryEntity;
  
  async createSubsidiary(subsidiary: DeepPartial<SubsidiaryEntity>): Promise<SubsidiaryEntity> {
    try {
      return await this.repository.save(subsidiary);
    } catch (error) {
      throw new HttpException('Create subsidiary error', 500);
    }
  }

  async findAll() {
    try {
      return await this.repository.find();
    } catch (error) {
      throw new HttpException('Find subsidiaries error', 500);
    }
  }

  async updateSubsidiary(
    subsidiaryId: number,
    subsidiary: DeepPartial<SubsidiaryEntity>,
  ): Promise<SubsidiaryEntity> {
    try {
      const existingSubsidiary = await this.repository.findOne({where:{id:subsidiaryId}});
      if (!existingSubsidiary) {
        throw new HttpException('Subsidiary not found', 404);
      }
      Object.assign(existingSubsidiary, subsidiary);

      const updatedSubsidiary = await this.repository.save(existingSubsidiary);
      return updatedSubsidiary;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error; 
      }
      throw new HttpException('Update subsidiary error', 500);
    }
  }

  async findByID(subsidiaryId: number): Promise<SubsidiaryEntity> {
    try {
      const subsidiary = await this.repository.findOne({
        where: {
          id: subsidiaryId,
        }
      });
      
      if (!subsidiary) {
        throw new HttpException('Subsidiary not found', 404);
      }
      
      return subsidiary;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error; 
      }
      throw new HttpException('Find subsidiary by id error', 500);
    }
  }
}