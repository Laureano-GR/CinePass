import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
} from '@nestjs/common';
import { GenreEntity } from 'src/_entities/genre.entity';
import { DeepPartial } from "typeorm";
import { GenreService } from './genre.service';

@Controller('genres')
export class GenreController {
  constructor(private service: GenreService) {}
  
    @Post()
    async createGenre(
      @Body() genre: DeepPartial<GenreEntity>,
    ): Promise<GenreEntity> {
      return await this.service.createGenre(genre);
    }
  
    @Get()
    async findAll() {
      return await this.service.findAll();
    }
  
    @Put('update/:id')
    async updateGenre(
      @Param('id') id: number,
      @Body() genre: DeepPartial<GenreEntity>,
    ): Promise<GenreEntity> {
      const updatedGenre = await this.service.updateGenre(id, genre);
      return updatedGenre;
    }
    
    @Get(':id')
    async findByID(@Param('id') id: number): Promise<GenreEntity> {
      return await this.service.findByID(id);
    }
}