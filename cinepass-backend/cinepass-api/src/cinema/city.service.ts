import { HttpException, Injectable } from '@nestjs/common';
import { CityEntity } from 'src/_entities/city.entity';
import { DeepPartial } from "typeorm";

@Injectable()
export class CityService {
  repository = CityEntity;
  
  async createCity(city: DeepPartial<CityEntity>): Promise<CityEntity> {
    try {
      return await this.repository.save(city);
    } catch (error) {
      throw new HttpException('Create city error', 500);
    }
  }

  async findAll() {
    try {
      return await this.repository.find();
    } catch (error) {
      throw new HttpException('Find cities error', 500);
    }
  }

  async updateCity(
    cityId: number,
    city: DeepPartial<CityEntity>,
  ): Promise<CityEntity> {
    try {
      const existingCity = await this.repository.findOne({where:{id:cityId}});
      if (!existingCity) {
        throw new HttpException('City not found', 404);
      }
      Object.assign(existingCity, city);

      const updatedCity = await this.repository.save(existingCity);
      return updatedCity;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error; 
      }
      throw new HttpException('Update city error', 500);
    }
  }

  async findByID(cityId: number): Promise<CityEntity> {
    try {
      const city = await this.repository.findOne({
        where: {
          id: cityId,
        }
      });
      
      if (!city) {
        throw new HttpException('City not found', 404);
      }
      
      return city;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error; 
      }
      throw new HttpException('Find city by id error', 500);
    }
  }
}