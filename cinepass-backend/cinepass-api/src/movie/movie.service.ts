import { HttpException, Injectable } from '@nestjs/common';
import { MovieEntity } from 'src/_entities/movie.entity';
import { DeepPartial } from "typeorm";

@Injectable()
export class MovieService {
  repository = MovieEntity;

  async createMovie(movie: DeepPartial<MovieEntity>): Promise<MovieEntity> {
    try {
      return await this.repository.save(movie);
    } catch (error) {
      throw new HttpException('Create movie error', 500);
    }
  }

  async findAll() {
    try {
      return await this.repository.find();
    } catch (error) {
      throw new HttpException('Find movies error', 500);
    }
  }

  async updateMovie(
    movieId: number,
    movie: DeepPartial<MovieEntity>,
  ): Promise<MovieEntity> {
    try {
      const existingMovie = await this.repository.findOne({where:{id:movieId}});
      if (!existingMovie) {
        throw new HttpException('Movie not found', 404);
      }
      Object.assign(existingMovie, movie);

      const updatedMovie = await this.repository.save(existingMovie);
      return updatedMovie;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error; 
      }
      throw new HttpException('Update movie error', 500);
    }
  }

  async findByID(movieId: number): Promise<MovieEntity> {
    try {
      const movie = await this.repository.findOne({
        where: {
          id: movieId,
        }
      });
      
      if (!movie) {
        throw new HttpException('Movie not found', 404);
      }
      
      return movie;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error; 
      }
      throw new HttpException('Find movie by id error', 500);
    }
  }
}