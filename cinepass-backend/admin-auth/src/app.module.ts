import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from './entities';
import { AdminsModule } from './admin/admin.module';
import { JwtModule } from './jwt/jwt.module';
import { AuthGuard } from './middlewares/auth.middleware';
import { PermissionsModule } from './permissions/permissions.module';

@Module({
  imports: [
    AdminsModule,
    TypeOrmModule.forRoot({
      database: 'admins.db',
      entities,
      type: 'sqlite',
      synchronize: true,
    }),
    JwtModule,
    PermissionsModule,
    AdminsModule,
  ],
  controllers: [AppController],
  providers: [AuthGuard],
})
export class AppModule {}
