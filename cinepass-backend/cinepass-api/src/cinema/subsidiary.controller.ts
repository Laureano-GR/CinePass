import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  ParseIntPipe,
  HttpException,
} from '@nestjs/common';
import { SubsidiaryEntity } from 'src/_entities/subsidiary.entity';
import { DeepPartial } from "typeorm";
import { SubsidiaryService } from './subsidiary.service';
import { MovieEntity } from 'src/_entities/movie.entity';
import { ShowEntity } from 'src/_entities/show.entity';
import { readdirSync } from 'fs';
import { join } from 'path';
import { RoomEntity } from 'src/_entities/room.entity';


@Controller('subsidiaries')
export class SubsidiaryController {
  constructor(private service: SubsidiaryService) {}
  
    @Post()
    async createSubsidiary(
      @Body() subsidiary: DeepPartial<SubsidiaryEntity>,
    ): Promise<SubsidiaryEntity> {
      return await this.service.createSubsidiary(subsidiary);
    }
  
    @Get()
    async findAll() {
      return await this.service.findAll();
    }
  
    @Put('update/:id')
    async updateSubsidiary(
      @Param('id') id: number,
      @Body() subsidiary: DeepPartial<SubsidiaryEntity>,
    ): Promise<SubsidiaryEntity> {
      const updatedSubsidiary = await this.service.updateSubsidiary(id,subsidiary);
      return updatedSubsidiary;
    }

    @Get('banners')
    getBanners(): string[] {
      const bannersDir = join(__dirname, '..', '..', 'uploads', 'banners');
      return readdirSync(bannersDir).map(file => `http://localhost:3001/banners/${file}`);
    }

    @Get(':id')
    async findByID(@Param('id') id: number): Promise<SubsidiaryEntity> {
      return await this.service.findByID(id);
    }

    @Get(':id/upcoming-movies')
      async findUpcomingMovies(
        @Param('id', ParseIntPipe) subsidiaryId: number,
      ): Promise<MovieEntity[]> {
        try {
          return await this.service.findUpcomingMovies(subsidiaryId);
        } catch (error) {
          throw new HttpException(error.message, error.status || 500);
        }
      } 

    @Get('movies/:id')
    async findSubsidiaryMovies(@Param('id') id: number): Promise <MovieEntity[]>{
      return await this.service.findSubsidiaryMovies(id);
    }

    @Get('shows/:id')
    async findSubsidiaryShows(@Param('id') id: number): Promise<ShowEntity[]> {
      return await this.service.findSubsidiaryShows(id);
    }

    @Get('rooms/:id')
    async findSubsidiaryRooms(@Param('id') id: number): Promise<RoomEntity[]> {
      return await this.service.findSubsidiaryRooms(id);
    }
}