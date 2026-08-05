import { HttpException, Injectable } from '@nestjs/common';
import { GenreEntity } from 'src/_entities/genre.entity';
import { DeepPartial } from "typeorm";

@Injectable()
export class GenreService {
  repository = GenreEntity;
  
  async createGenre(genre: DeepPartial<GenreEntity>): Promise<GenreEntity> {
    try {
      return await this.repository.save(genre);
    } catch (error) {
      throw new HttpException('Create genre error', 500);
    }
  }

  async findAll() {
    try {
      return await this.repository.find();
    } catch (error) {
      throw new HttpException('Find genres error', 500);
    }
  }

  async updateGenre(
    genreId: number,
    genre: DeepPartial<GenreEntity>,
  ): Promise<GenreEntity> {
    try {
      const existingGenre = await this.repository.findOne({where:{id:genreId}});
      if (!existingGenre) {
        throw new HttpException('Genre not found', 404);
      }
      Object.assign(existingGenre, genre);

      const updatedGenre = await this.repository.save(existingGenre);
      return updatedGenre;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error; 
      }
      throw new HttpException('Update genre error', 500);
    }
  }

  async findByID(genreId: number): Promise<GenreEntity> {
    try {
      const genre = await this.repository.findOne({
        where: {
          id: genreId,
        }
      });
      
      if (!genre) {
        throw new HttpException('Genre not found', 404);
      }
      
      return genre;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error; 
      }
      throw new HttpException('Find genre by id error', 500);
    }
  }
}