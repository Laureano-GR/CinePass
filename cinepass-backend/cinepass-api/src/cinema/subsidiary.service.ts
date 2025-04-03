import { HttpException, Injectable } from '@nestjs/common';
import { MovieEntity } from 'src/_entities/movie.entity';
import { ShowEntity } from 'src/_entities/show.entity';
import { SubsidiaryEntity } from 'src/_entities/subsidiary.entity';
import { DeepPartial } from "typeorm";
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';
import { RoomEntity } from 'src/_entities/room.entity';

@Injectable()
export class SubsidiaryService {
  repository = SubsidiaryEntity;
  
  async createSubsidiary(subsidiary: DeepPartial<SubsidiaryEntity>): Promise<SubsidiaryEntity> {
    try {
      subsidiary.subsidiaryCode = await bcrypt.hash(subsidiary.subsidiaryCode, 10);
      return await this.repository.save(subsidiary);
    } catch (error) {
      throw new HttpException('Create subsidiary error', 500);
    }
  }

  async findAll() {
    try {
      return await this.repository.find({
        relations: ['address']
      });
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
      if (subsidiary.subsidiaryCode) {
        subsidiary.subsidiaryCode = await bcrypt.hash(subsidiary.subsidiaryCode, 10);
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
        },
        relations: ['address']
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

  async findSubsidiaryMovies(subsidiaryId: number): Promise<MovieEntity[]> {
    const subsidiary = await this.repository.findOne({
      where: { id: subsidiaryId },
      relations: [
        'shows', 
        'shows.movie', 
        'shows.movie.genre', 
        'shows.movie.contentRating', 
        'shows.movie.languages',
        'shows.movie.shows',
        'shows.movie.showTypes',
      ],
    });

    if (!subsidiary) {
        throw new Error(`Subsidiary with ID ${subsidiaryId} not found.`);
    }

    const movieSet = new Set<number>();
    const movies: MovieEntity[] = [];

    for (const show of subsidiary.shows) {
        const movie = show.movie;
        if (movie && !movieSet.has(movie.id)) {
            movieSet.add(movie.id);
            movies.push(movie);
        }
    }

    return movies;
  }

  async findSubsidiaryShows(subsidiaryId: number): Promise<ShowEntity[]> {
    try {
      const subsidiary = await this.repository.findOne({
        where: { id: subsidiaryId },
        relations: ['shows', 'shows.movie', 'shows.room', 'shows.showType', 'shows.selectedLanguage'],
      });

      if (!subsidiary) {
        throw new HttpException(`Subsidiary with ID ${subsidiaryId} not found`, 404);
      }

      return subsidiary.shows;
    } catch (error) {
      throw new HttpException('Find subsidiary shows error', 500);
    }
  }

  async findSubsidiaryRooms(subsidiaryId: number): Promise<RoomEntity[]> {
    try {
      const subsidiary = await this.repository.findOne({
        where: { id: subsidiaryId },
        relations: ['rooms', 'rooms.showTypes'],
      });

      if (!subsidiary) {
        throw new HttpException(`Subsidiary with ID ${subsidiaryId} not found`, 404);
      }

      return subsidiary.rooms;
    } catch (error) {
      throw new HttpException('Find subsidiary rooms error', 500);
    }
  }
}