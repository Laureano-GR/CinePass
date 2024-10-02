import { HttpException, Injectable } from '@nestjs/common';
import { LanguageEntity } from 'src/_entities/language.entity';
import { DeepPartial } from "typeorm";

@Injectable()
export class LanguageService {
  repository = LanguageEntity;
  
  async createLanguage(language: DeepPartial<LanguageEntity>): Promise<LanguageEntity> {
    try {
      return await this.repository.save(language);
    } catch (error) {
      throw new HttpException('Create language error', 500);
    }
  }

  async findAll() {
    try {
      return await this.repository.find();
    } catch (error) {
      throw new HttpException('Find languages error', 500);
    }
  }

  async updateLanguage(
    languageId: number,
    language: DeepPartial<LanguageEntity>,
  ): Promise<LanguageEntity> {
    try {
      const existingLanguage = await this.repository.findOne({where:{id:languageId}});
      if (!existingLanguage) {
        throw new HttpException('Language not found', 404);
      }
      Object.assign(existingLanguage, language);

      const updatedLanguage = await this.repository.save(existingLanguage);
      return updatedLanguage;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error; 
      }
      throw new HttpException('Update language error', 500);
    }
  }

  async findByID(languageId: number): Promise<LanguageEntity> {
    try {
      const language = await this.repository.findOne({
        where: {
          id: languageId,
        }
      });
      
      if (!language) {
        throw new HttpException('Language not found', 404);
      }
      
      return language;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error; 
      }
      throw new HttpException('Find language by id error', 500);
    }
  }
}