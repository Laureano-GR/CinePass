import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { FileUploadController } from './file-upload.controller';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads', // Carpeta donde se guardarán los archivos
    }),
  ],
  controllers: [FileUploadController],
})
export class FileUploadModule {}