import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
} from '@nestjs/common';
import { MovieEntity } from 'src/_entities/movie.entity';
import { DeepPartial } from "typeorm";
import { MovieService } from './movie.service';

@Controller('movies')
export class MovieController {
  constructor(private service: MovieService) {}
  
    @Post()
    async createMovie(
      @Body() movie: DeepPartial<MovieEntity>,
    ): Promise<MovieEntity> {
      return await this.service.createMovie(movie);
    }
  
    @Get()
    async findAll() {
      return await this.service.findAll();
    }
  
    @Put('update/:id')
    async updateMovie(
      @Param('id') id: number,
      @Body() movie: DeepPartial<MovieEntity>,
    ): Promise<MovieEntity> {
      const updatedMovie= await this.service.updateMovie(id, movie);
      return updatedMovie;
    }
    
    @Get(':id')
    async findByID(@Param('id') id: number): Promise<MovieEntity> {
      return await this.service.findByID(id);
    }
}