import { Module } from '@nestjs/common';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { GenreController } from './genre.controller';
import { ContentRatingController } from './contentRating.controller';
import { LanguagesController } from './language.controller';
import { GenreService } from './genre.service';
import { ContentRatingService } from './contentRating.service';
import { LanguageService } from './language.service';

@Module({
  controllers: [MoviesController, GenreController, ContentRatingController, LanguagesController],
  providers: [MoviesService, GenreService, ContentRatingService, LanguageService]
})
export class MoviesModule {}
