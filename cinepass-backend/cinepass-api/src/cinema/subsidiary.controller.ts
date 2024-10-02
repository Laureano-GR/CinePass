import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
} from '@nestjs/common';
import { SubsidiaryEntity } from 'src/_entities/subsidiary.entity';
import { DeepPartial } from "typeorm";
import { SubsidiaryService } from './subsidiary.service';

@Controller('subsidiaries')
export class SubsidiaryController {
  constructor(private service: SubsidiaryService) {}
  
    @Post()
    async createSubsidiary(
      @Body() subsidiary: DeepPartial<SubsidiaryEntity>,
    ): Promise<SubsidiaryEntity> {
      return await this.service.createSubsidiary(subsidiary);
    }
  
    @Get()
    async findAll() {
      return await this.service.findAll();
    }
  
    @Put('update/:id')
    async updateSubsidiary(
      @Param('id') id: number,
      @Body() subsidiary: DeepPartial<SubsidiaryEntity>,
    ): Promise<SubsidiaryEntity> {
      const updatedSubsidiary = await this.service.updateSubsidiary(id,subsidiary);
      return updatedSubsidiary;
    }
    
    @Get(':id')
    async findByID(@Param('id') id: number): Promise<SubsidiaryEntity> {
      return await this.service.findByID(id);
    }
}