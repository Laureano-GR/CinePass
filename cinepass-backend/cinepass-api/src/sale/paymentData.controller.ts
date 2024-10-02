import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
} from '@nestjs/common';
import { PaymentDataEntity } from 'src/_entities/paymentData.entity';
import { DeepPartial } from "typeorm";
import { PaymentDataService } from './paymentData.service';

@Controller('payments-data')
export class PaymentDataController {
  constructor(private service: PaymentDataService) {}
  
  @Post()
  async createPaymentData(
    @Body() paymentData: DeepPartial<PaymentDataEntity>,
  ): Promise<PaymentDataEntity> {
    return await this.service.createPaymentData(paymentData);
  }

  @Get()
  async findAll() {
    return await this.service.findAll();
  }

  @Put('update/:id')
  async updatePaymentData(
    @Param('id') id: number,
    @Body() paymentData: DeepPartial<PaymentDataEntity>,
  ): Promise<PaymentDataEntity> {
    const updatedPaymentData= await this.service.updatePaymentData(id, paymentData);
    return updatedPaymentData;
  }
  
  @Get(':id')
  async findByID(@Param('id') id: number): Promise<PaymentDataEntity> {
    return await this.service.findByID(id);
  }
}