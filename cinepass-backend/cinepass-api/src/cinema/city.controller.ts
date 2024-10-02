import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
} from '@nestjs/common';
import { CityEntity } from 'src/_entities/city.entity';
import { DeepPartial } from "typeorm";
import { CityService} from './city.service';

@Controller('cities')
export class CityController {
  constructor(private service: CityService) {}
  
    @Post()
    async createCity(
      @Body() city: DeepPartial<CityEntity>,
    ): Promise<CityEntity> {
      return await this.service.createCity(city);
    }
  
    @Get()
    async findAll() {
      return await this.service.findAll();
    }
  
    @Put('update/:id')
    async updateCity(
      @Param('id') id: number,
      @Body() city: DeepPartial<CityEntity>,
    ): Promise<CityEntity> {
      const updatedCity = await this.service.updateCity(id, city);
      return updatedCity;
    }
    
    @Get(':id')
    async findByID(@Param('id') id: number): Promise<CityEntity> {
      return await this.service.findByID(id);
    }
}