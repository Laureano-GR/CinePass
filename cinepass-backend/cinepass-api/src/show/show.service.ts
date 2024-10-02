import { HttpException, Injectable } from '@nestjs/common';
import { ShowEntity } from 'src/_entities/show.entity';
import { DeepPartial } from "typeorm";

@Injectable()
export class ShowService {
  repository = ShowEntity;
  
  async createShow(show: DeepPartial<ShowEntity>): Promise<ShowEntity> {
    try {
      return await this.repository.save(show);
    } catch (error) {
      throw new HttpException('Create show error', 500);
    }
  }

  async findAll() {
    try {
      return await this.repository.find();
    } catch (error) {
      throw new HttpException('Find shows error', 500);
    }
  }

  async updateShow(
    showId: number,
    show: DeepPartial<ShowEntity>,
  ): Promise<ShowEntity> {
    try {
      const existingShow = await this.repository.findOne({where:{id:showId}});
      if (!existingShow) {
        throw new HttpException('Show not found', 404);
      }
      Object.assign(existingShow, show);

      const updatedShow = await this.repository.save(existingShow);
      return updatedShow;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error; 
      }
      throw new HttpException('Update show error', 500);
    }
  }

  async findByID(showId: number): Promise<ShowEntity> {
    try {
      const show = await this.repository.findOne({
        where: {
          id: showId,
        }
      });
      
      if (!show) {
        throw new HttpException('Show not found', 404);
      }
      
      return show;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error; 
      }
      throw new HttpException('Find show by id error', 500);
    }
  }
}