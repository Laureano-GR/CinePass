import { HttpException, Injectable } from '@nestjs/common';
import { PaymentDataEntity } from 'src/_entities/paymentData.entity';
import { DeepPartial } from "typeorm";

@Injectable()
export class PaymentDataService {
  repository = PaymentDataEntity;
  
  async createPaymentData(paymentData: DeepPartial<PaymentDataEntity>): Promise<PaymentDataEntity> {
    try {
      const savedPaymentData = await this.repository.save(paymentData);
      return savedPaymentData;
    } catch (error) {
      throw new HttpException('Create payment data error', 500);
    }
  }

  async findAll() {
    try {
      return await this.repository.find({
        relations:['IDType']
      },);
    } catch (error) {
      throw new HttpException('Find payments data error', 500);
    }
  }

  async updatePaymentData(
    paymentDataId: number,
    paymentData: DeepPartial<PaymentDataEntity>,
  ): Promise<PaymentDataEntity> {
    try {
      const existingPaymentData = await this.repository.findOne({where:{id:paymentDataId}});
      if (!existingPaymentData) {
        throw new HttpException('Payment data not found', 404);
      }
      Object.assign(existingPaymentData, paymentData);

      const updatedPaymentData = await this.repository.save(existingPaymentData);
      return updatedPaymentData;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error; 
      }
      throw new HttpException('Update payment data error', 500);
    }
  }

  async findByID(paymentDataId: number): Promise<PaymentDataEntity> {
    try {
      const paymentData = await this.repository.findOne({
        where: {
          id: paymentDataId,
        },
          relations:['IDType'],
      });
      
      if (!paymentData) {
        throw new HttpException('Payment data not found', 404);
      }
      
      return paymentData;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error; 
      }
      throw new HttpException('Find payment data by id error', 500);
    }
  }
}