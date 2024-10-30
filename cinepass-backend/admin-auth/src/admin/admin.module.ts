import { Module } from '@nestjs/common';
import { AdminsService } from './admin.service';
import { AdminsController } from './admin.controller';
import { JwtModule } from 'src/jwt/jwt.module';

@Module({
  providers: [AdminsService],
  controllers: [AdminsController],
  imports: [JwtModule],
  exports: [AdminsService],
})
export class AdminsModule {}
