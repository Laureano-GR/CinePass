import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { JwtModule } from 'src/jwt/jwt.module';

@Module({
  providers: [UsersService],
  controllers: [UsersController],
  imports: [JwtModule],
  exports: [UsersService],
})
export class UsersModule {}
