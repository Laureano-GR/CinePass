import { Injectable, HttpException } from '@nestjs/common';
import { MovieEntity } from 'src/_entities/movie.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LanguageEntity } from 'src/_entities/language.entity';
import { ContentRatingEntity } from 'src/_entities/contentRating.entity';
import { GenreEntity } from 'src/_entities/genre.entity';
import { CreateMovieDto } from 'src/_interfaces/createMovie.dto';
import { DeepPartial } from "typeorm";
import { UpdateMovieDto } from 'src/_interfaces/updateMovie.dto';
import { join } from 'path';
import { existsSync } from 'fs'; 
import { ShowTypeEntity } from 'src/_entities/showType.entity';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(MovieEntity)
    private movieRepository: Repository<MovieEntity>,
    
    @InjectRepository(LanguageEntity)
    private languageRepository: Repository<LanguageEntity>,
    
    @InjectRepository(GenreEntity)
    private genreRepository: Repository<GenreEntity>,
    
    @InjectRepository(ContentRatingEntity)
    private contentRatingRepository: Repository<ContentRatingEntity>,
    
    @InjectRepository(ShowTypeEntity)
    private showTypeRepository: Repository<ShowTypeEntity>,
  ) {}


  async createMovie(createMovieDto: CreateMovieDto): Promise<MovieEntity> {
    try {
      // Cargar los idiomas, género y calificación de contenido usando los IDs del DTO
      const languages = await this.languageRepository.findByIds(createMovieDto.languageIds);
      const genre = await this.genreRepository.findOne({
        where: { id: createMovieDto.genreId },
      });
      const contentRating = await this.contentRatingRepository.findOne({
        where: { id: createMovieDto.contentRatingId },
      });

      const showTypes = await this.showTypeRepository.findByIds(createMovieDto.showTypeIds);

      if (!genre || !languages.length || !contentRating || !showTypes.length) {
        throw new HttpException('Invalid genres, languages or content rating', 400);
      }

      // Crear una nueva película asignando las relaciones
      const newMovie = this.movieRepository.create({
        name: createMovieDto.name,
        poster: createMovieDto.poster,
        description: createMovieDto.description,
        duration: createMovieDto.duration,
        languages: languages,
        showTypes: showTypes,
        genre: genre,
        contentRating: contentRating
      });

      // Guardar la película
      return await this.movieRepository.save(newMovie);
    } catch (error) {
      throw new HttpException('Create movie error', 500);
    }
  }

  async findAll() {
    try {
      return await this.movieRepository
        .createQueryBuilder('movie')
        .leftJoinAndSelect('movie.languages', 'language')
        .leftJoinAndSelect('movie.contentRating', 'contentRating')
        .leftJoinAndSelect('movie.genre', 'genre')
        .leftJoinAndSelect('movie.showTypes', 'showType')
        .getMany();
    } catch (error) {
      throw new HttpException('Find movies error', 500);
    }
  }

  async updateMovie(movieId: number, updateMovieDto: UpdateMovieDto): Promise<MovieEntity> {
    try {
      // Buscar la película existente
      const movie = await this.movieRepository.findOne({
        where: { id: movieId },
      });
      if (!movie) {
        throw new HttpException('Movie not found', 404);
      }

      // Cargar los idiomas, género y calificación de contenido si están presentes en el DTO
      if (updateMovieDto.languageIds) {
        movie.languages = await this.languageRepository.findByIds(updateMovieDto.languageIds);
      }
      if (updateMovieDto.showTypeIds) {
        movie.showTypes = await this.showTypeRepository.findByIds(updateMovieDto.showTypeIds);
      }
      if (updateMovieDto.genreId) {
        movie.genre = await this.genreRepository.findOne({
          where: { id: updateMovieDto.genreId },
        });
      }
      if (updateMovieDto.contentRatingId) {
        movie.contentRating = await this.contentRatingRepository.findOne({
          where: { id: updateMovieDto.contentRatingId },
        });
      }

      // Actualizar solo los campos que fueron proporcionados en el DTO
      movie.name = updateMovieDto.name ?? movie.name;
      movie.poster = updateMovieDto.poster ?? movie.poster;
      movie.description = updateMovieDto.description ?? movie.description;
      movie.duration = updateMovieDto.duration ?? movie.duration;

      // Guardar la película actualizada
      return await this.movieRepository.save(movie);
    } catch (error) {
      throw new HttpException('Update movie error', 500);
    }
  }

  async findByID(movieId: number): Promise<MovieEntity> {
    try {
      const movie = await this.movieRepository.findOne({
        where: {
          id: movieId,
        },
        relations: ['languages','showTypes', 'contentRating', 'genre', 'shows'], // Incluir la relación 'shows' y 'subsidiary'
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

  async getPosterFile(movieId: number): Promise<string> {
    try {
      const movie = await this.movieRepository.findOne({
        where: { id: movieId },
      });

      if (!movie) {
        throw new HttpException('Movie not found', 404);
      }

      const posterPath = join(__dirname, '..', '..', 'uploads', 'posters', movie.poster);
      if (!existsSync(posterPath)) {
        throw new HttpException('Poster file not found', 404);
      }

      return posterPath;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Get poster file error', 500);
    }
  }
}