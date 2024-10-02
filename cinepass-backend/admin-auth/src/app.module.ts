import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from './entities';
import { UsersModule } from './users/users.module';
import { JwtModule } from './jwt/jwt.module';
import { AuthGuard } from './middlewares/auth.middleware';
import { PermissionsModule } from './permissions/permissions.module';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forRoot({
      database: 'db.sqlite',
      entities,
      type: 'sqlite',
      synchronize: true,
    }),
    JwtModule,
    PermissionsModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AuthGuard],
})
export class AppModule {}
