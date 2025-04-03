import { HttpException, Injectable } from '@nestjs/common';
import { PaymentMethodEntity } from 'src/_entities/paymentMethod';
import { DeepPartial } from "typeorm";

@Injectable()
export class PaymentMethodService {
  repository = PaymentMethodEntity;

  async createPaymentMethod(paymentMethod: DeepPartial<PaymentMethodEntity>): Promise<PaymentMethodEntity> {
    try {
      return await this.repository.save(paymentMethod);
    } catch (error) {
      throw new HttpException('Create payment method error', 500);
    }
  }

  async findAll() {
    try {
      return await this.repository.find();
    } catch (error) {
      throw new HttpException('Find payment method error', 500);
    }
  }

  async updatePaymentMethod(
    paymentMethodId: number,
    paymentMethod: DeepPartial<PaymentMethodEntity>,
  ): Promise<PaymentMethodEntity> {
    try {
      const existingPaymentMethod = await this.repository.findOne({where:{id:paymentMethodId}});
      if (!existingPaymentMethod) {
        throw new HttpException('Payment method not found', 404);
      }
      Object.assign(existingPaymentMethod, paymentMethod);

      const updatedPaymentMethod = await this.repository.save(existingPaymentMethod);
      return updatedPaymentMethod;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error; 
      }
      throw new HttpException('Update payment method error', 500);
    }
  }

  async findByID(paymentMethodId: number): Promise<PaymentMethodEntity> {
    try {
      const paymentMethod = await this.repository.findOne({
        where: {
          id: paymentMethodId,
        }
      });
      
      if (!paymentMethod) {
        throw new HttpException('Payment method not found', 404);
      }
      
      return paymentMethod;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error; 
      }
      throw new HttpException('Find payment method by id error', 500);
    }
  }
}