import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('upload')
export class FileUploadController {
  @Post()
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const fileExtName = extname(file.originalname);
        const fileName = file.originalname.replace(fileExtName, '');
        cb(null, `${fileName}${fileExtName}`);
      },
    }),
  }))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return { filePath: `/uploads/${file.filename}` };
  }

  @Post('poster')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/posters',
      filename: (req, file, cb) => {
        const fileExtName = extname(file.originalname);
        const fileName = file.originalname.replace(fileExtName, '');
        cb(null, `${fileName}${fileExtName}`);
      },
    }),
  }))
  uploadPoster(@UploadedFile() file: Express.Multer.File) {
    return { filePath: `/uploads/posters/${file.filename}` };
  }
}