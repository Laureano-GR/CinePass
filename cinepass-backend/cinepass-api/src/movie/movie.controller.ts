import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Res,
  HttpException,
} from '@nestjs/common';
import { MovieEntity } from 'src/_entities/movie.entity';
import { DeepPartial } from "typeorm";
import { MovieService } from './movie.service';
import { UpdateMovieDto } from 'src/_interfaces/updateMovie.dto';
import { CreateMovieDto } from 'src/_interfaces/createMovie.dto';
import { Response } from 'express';
import { createReadStream } from 'fs';

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

    @Get(':id/poster')
    async getPoster(@Param('id') id: number, @Res() res: Response) {
      try {
        const posterPath = await this.service.getPosterFile(id);
        const fileStream = createReadStream(posterPath);
        fileStream.pipe(res);
      } catch (error) {
        if (error instanceof HttpException) {
          throw error;
        }
        throw new HttpException('Get poster error', 500);
      }
    }
}