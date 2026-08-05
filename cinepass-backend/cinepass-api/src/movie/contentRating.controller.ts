import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
} from '@nestjs/common';
import { ContentRatingEntity } from 'src/_entities/contentRating.entity';
import { DeepPartial } from "typeorm";
import { ContentRatingService } from './contentRating.service';

@Controller('content-ratings')
export class ContentRatingController {
  constructor(private service: ContentRatingService) {}
  
    @Post()
    async createContentRating(
      @Body() contentRating: DeepPartial<ContentRatingEntity>,
    ): Promise<ContentRatingEntity> {
      return await this.service.createContentRating(contentRating);
    }
  
    @Get()
    async findAll() {
      return await this.service.findAll();
    }
  
    @Put('update/:id')
    async updateContentRating(
      @Param('id') id: number,
      @Body() contentRating: DeepPartial<ContentRatingEntity>,
    ): Promise<ContentRatingEntity> {
      const updatedContentRating = await this.service.updateContentRating(id, contentRating);
      return updatedContentRating;
    }
    
    @Get(':id')
    async findByID(@Param('id') id: number): Promise<ContentRatingEntity> {
      return await this.service.findByID(id);
    }
}