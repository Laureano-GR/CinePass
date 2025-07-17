import { Module } from '@nestjs/common';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';
import { GenreController } from './genre.controller';
import { ContentRatingController } from './contentRating.controller';
import { LanguageController } from './language.controller';
import { GenreService } from './genre.service';
import { ContentRatingService } from './contentRating.service';
import { LanguageService } from './language.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieEntity } from 'src/_entities/movie.entity';
import { LanguageEntity } from 'src/_entities/language.entity';
import { GenreEntity } from 'src/_entities/genre.entity';
import { ContentRatingEntity } from 'src/_entities/contentRating.entity';
import { ShowTypeEntity } from 'src/_entities/showType.entity';
import { ShowTypeController } from 'src/show/showType.controller';
import { ShowTypeService } from 'src/show/showType.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([MovieEntity, LanguageEntity, GenreEntity, ContentRatingEntity, ShowTypeEntity]),
  ],
  controllers: [MovieController, GenreController, ContentRatingController, LanguageController, ShowTypeController],
  providers: [MovieService, GenreService, ContentRatingService, LanguageService, ShowTypeService],
})
export class MovieModule {}
