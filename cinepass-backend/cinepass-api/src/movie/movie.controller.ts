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
import { UpdateMovieDto } from 'src/_interfaces/updateMovie.dto';
import { CreateMovieDto } from 'src/_interfaces/createMovie.dto';

@Controller('movies')
export class MovieController {
  constructor(private service: MovieService) {}
  
    @Post()
    async createMovie(@Body() createMovieDto: CreateMovieDto): Promise<MovieEntity> {
      return await this.service.createMovie(createMovieDto);
    }
  
    @Get()
    async findAll() {
      return await this.service.findAll();
    }
  
    @Put('update/:id')
    async updateMovie(
      @Param('id') id: number,
      @Body() updateMovieDto: UpdateMovieDto 
    ): Promise<MovieEntity> {
      return await this.service.updateMovie(id, updateMovieDto);
    }
    
    @Get(':id')
    async findByID(@Param('id') id: number): Promise<MovieEntity> {
      return await this.service.findByID(id);
    }
}