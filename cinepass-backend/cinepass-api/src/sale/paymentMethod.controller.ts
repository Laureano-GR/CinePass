import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
} from '@nestjs/common';
import { PaymentMethodEntity } from 'src/_entities/paymentMethod';
import { DeepPartial } from "typeorm";
import { PaymentMethodService } from './paymentMethod.service';

@Controller('payment-methods')
export class PaymentMethodController {
  constructor(private service: PaymentMethodService) {}
  
    @Post()
    async createPaymentMethod(
      @Body() paymentMethod: DeepPartial<PaymentMethodEntity>,
    ): Promise<PaymentMethodEntity> {
      return await this.service.createPaymentMethod(paymentMethod);
    }
  
    @Get()
    async findAll() {
      return await this.service.findAll();
    }
  
    @Put('update/:id')
    async updatePaymentMehod(
      @Param('id') id: number,
      @Body() paymentMethod: DeepPartial<PaymentMethodEntity>,
    ): Promise<PaymentMethodEntity> {
      const updatedPaymentMethod= await this.service.updatePaymentMethod(id, paymentMethod);
      return updatedPaymentMethod;
    }
    
    @Get(':id')
    async findByID(@Param('id') id: number): Promise<PaymentMethodEntity> {
      return await this.service.findByID(id);
    }
}