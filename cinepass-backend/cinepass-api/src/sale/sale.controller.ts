import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
} from '@nestjs/common';
import { SaleEntity } from 'src/_entities/sale.entity';
import { DeepPartial } from "typeorm";
import { SaleService } from './sale.service';

@Controller('sales')
export class SaleController {
  constructor(private service: SaleService) {}
  
    @Post()
    async createSale(
      @Body() sale: DeepPartial<SaleEntity>,
    ): Promise<SaleEntity> {
      return await this.service.createSale(sale);
    }
  
    @Get()
    async findAll() {
      return await this.service.findAll();
    }
  
    @Put('update/:id')
    async updateSale(
      @Param('id') id: number,
      @Body() sale: DeepPartial<SaleEntity>,
    ): Promise<SaleEntity> {
      const updatedSale= await this.service.updateSale(id, sale);
      return updatedSale;
    }
    
    @Get(':id')
    async findByID(@Param('id') id: number): Promise<SaleEntity> {
      return await this.service.findByID(id);
    }
}
