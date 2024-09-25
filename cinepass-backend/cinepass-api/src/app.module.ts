import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CinemasModule } from './cinema/cinema.module';
import { MoviesModule } from './movies/movies.module';
import { ShowsModule } from './shows/shows.module';
import { SalesModule } from './sales/sales.module';

@Module({
  imports: [CinemasModule, MoviesModule, ShowsModule, SalesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
