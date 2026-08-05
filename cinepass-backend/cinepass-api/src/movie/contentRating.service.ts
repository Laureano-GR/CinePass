import { HttpException, Injectable } from '@nestjs/common';
import { ContentRatingEntity } from 'src/_entities/contentRating.entity';
import { DeepPartial } from "typeorm";

@Injectable()
export class ContentRatingService {
  repository = ContentRatingEntity;
  
  async createContentRating(contentRating: DeepPartial<ContentRatingEntity>): Promise<ContentRatingEntity> {
    try {
      return await this.repository.save(contentRating);
    } catch (error) {
      throw new HttpException('Create content rating error', 500);
    }
  }

  async findAll() {
    try {
      return await this.repository.find();
    } catch (error) {
      throw new HttpException('Find content ratings error', 500);
    }
  }

  async updateContentRating(
    contentRatingId: number,
    contentRating: DeepPartial<ContentRatingEntity>,
  ): Promise<ContentRatingEntity> {
    try {
      const existingContentRating = await this.repository.findOne({where:{id:contentRatingId}});
      if (!existingContentRating) {
        throw new HttpException('Content rating not found', 404);
      }
      Object.assign(existingContentRating, contentRating);

      const updatedContentRating = await this.repository.save(existingContentRating);
      return updatedContentRating;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error; 
      }
      throw new HttpException('Update content rating error', 500);
    }
  }

  async findByID(contentRatingId: number): Promise<ContentRatingEntity> {
    try {
      const contentRating = await this.repository.findOne({
        where: {
          id: contentRatingId,
        }
      });
      
      if (!contentRating) {
        throw new HttpException('Content rating not found', 404);
      }
      
      return contentRating;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error; 
      }
      throw new HttpException('Find content rating by id error', 500);
    }
  }
}