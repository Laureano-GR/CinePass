import { Module } from '@nestjs/common';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';
import { GenreController } from './genre.controller';
import { ContentRatingController } from './contentRating.controller';
import { LanguagesController } from './language.controller';
import { GenreService } from './genre.service';
import { ContentRatingService } from './contentRating.service';
import { LanguageService } from './language.service';

@Module({
  controllers: [MovieController, GenreController, ContentRatingController, LanguagesController],
  providers: [MovieService, GenreService, ContentRatingService, LanguageService]
})
export class MovieModule {}