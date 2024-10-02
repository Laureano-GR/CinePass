import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
} from '@nestjs/common';
import { IDTypeEntity } from 'src/_entities/IDType.entity';
import { DeepPartial } from "typeorm";
import { IDTypeService } from './IDType.service';

@Controller('id-types')
export class IDTypeController {
  constructor(private service: IDTypeService) {}
  
    @Post()
    async createIDType(
      @Body() idType: DeepPartial<IDTypeEntity>,
    ): Promise<IDTypeEntity> {
      return await this.service.createIDType(idType);
    }
  
    @Get()
    async findAll() {
      return await this.service.findAll();
    }
  
    @Put('update/:id')
    async updateIDType(
      @Param('id') id: number,
      @Body() idType: DeepPartial<IDTypeEntity>,
    ): Promise<IDTypeEntity> {
      const updatedIDType= await this.service.updateIDType(id, idType);
      return updatedIDType;
    }
    
    @Get(':id')
    async findByID(@Param('id') id: number): Promise<IDTypeEntity> {
      return await this.service.findByID(id);
    }
}