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
import { CreateSaleDTO } from 'src/_interfaces/createSale.dto';


@Controller('sales')
export class SaleController {
  constructor(private service: SaleService) {}
  
  @Post()
  async processSale(@Body() createSaleDto: CreateSaleDTO): Promise<string> {
    return await this.service.processSale(createSaleDto);
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

  @Put('cancel/:id')
  async cancelSale(
    @Param('id') id: number,
  ): Promise<SaleEntity> {
    const canceledSale = await this.service.cancelSale(id);
    return canceledSale;
  }

  @Post('find')
  async findSales(
    @Body('purchaseId') purchaseId?: number,
    @Body('documentNumber') documentNumber?: string,
    @Body('dateFrom') dateFrom?: string,
    @Body('dateTo') dateTo?: string,
  ): Promise<SaleEntity[]> {
    return await this.service.findSales(purchaseId, documentNumber, dateFrom, dateTo);
  }
}
