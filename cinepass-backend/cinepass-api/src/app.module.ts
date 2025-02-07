import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CinemaModule } from './cinema/cinema.module';
import { MovieModule } from './movie/movie.module';
import { ShowModule } from './show/show.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SaleModule } from './sale/sale.module';
import { entities } from './_entities';
import { EmailManagerModule } from './email-manager/email-manager.module';

@Module({
  imports: [CinemaModule, MovieModule, ShowModule, SaleModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'cinepass.db',
      entities,
      synchronize: true,
    }),
    EmailManagerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
