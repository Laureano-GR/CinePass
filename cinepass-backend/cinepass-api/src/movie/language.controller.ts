import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
} from '@nestjs/common';
import { LanguageEntity } from 'src/_entities/language.entity';
import { DeepPartial } from "typeorm";
import { LanguageService } from './language.service';

@Controller('languages')
export class LanguageController {
  constructor(private service: LanguageService) {}
  
    @Post()
    async createLanguage(
      @Body() language: DeepPartial<LanguageEntity>,
    ): Promise<LanguageEntity> {
      return await this.service.createLanguage(language);
    }
  
    @Get()
    async findAll() {
      return await this.service.findAll();
    }
  
    @Put('update/:id')
    async updateLanguage(
      @Param('id') id: number,
      @Body() language: DeepPartial<LanguageEntity>,
    ): Promise<LanguageEntity> {
      const updatedLanguage= await this.service.updateLanguage(id, language);
      return updatedLanguage;
    }
    
    @Get(':id')
    async findByID(@Param('id') id: number): Promise<LanguageEntity> {
      return await this.service.findByID(id);
    }
}