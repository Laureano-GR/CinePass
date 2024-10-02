import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
} from '@nestjs/common';
import { ShowEntity } from 'src/_entities/show.entity';
import { DeepPartial } from "typeorm";
import { ShowService } from './show.service';

@Controller('shows')
export class ShowController {
  constructor(private service: ShowService) {}
  
    @Post()
    async createShow(
      @Body() show: DeepPartial<ShowEntity>,
    ): Promise<ShowEntity> {
      return await this.service.createShow(show);
    }
  
    @Get()
    async findAll() {
      return await this.service.findAll();
    }
  
    @Put('update/:id')
    async updateShow(
      @Param('id') id: number,
      @Body() show: DeepPartial<ShowEntity>,
    ): Promise<ShowEntity> {
      const updatedShow = await this.service.updateShow(id, show);
      return updatedShow;
    }
    
    @Get(':id')
    async findByID(@Param('id') id: number): Promise<ShowEntity> {
      return await this.service.findByID(id);
    }
}
