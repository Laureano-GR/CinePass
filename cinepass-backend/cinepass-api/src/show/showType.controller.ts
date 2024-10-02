import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
} from '@nestjs/common';
import { ShowTypeEntity } from 'src/_entities/showType.entity';
import { DeepPartial } from "typeorm";
import { ShowTypeService } from './showType.service';

@Controller('show-types')
export class ShowTypeController {
  constructor(private service: ShowTypeService) {}
  
    @Post()
    async createShowType(
      @Body() showType: DeepPartial<ShowTypeEntity>,
    ): Promise<ShowTypeEntity> {
      return await this.service.createShowType(showType);
    }
  
    @Get()
    async findAll() {
      return await this.service.findAll();
    }
  
    @Put('update/:id')
    async updateShowType(
      @Param('id') id: number,
      @Body() showType: DeepPartial<ShowTypeEntity>,
    ): Promise<ShowTypeEntity> {
      const updatedShow = await this.service.updateShowType(id, showType);
      return updatedShow;
    }
    
    @Get(':id')
    async findByID(@Param('id') id: number): Promise<ShowTypeEntity> {
      return await this.service.findByID(id);
    }
}