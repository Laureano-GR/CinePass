import { HttpException, Injectable } from '@nestjs/common';
import { SaleEntity } from 'src/_entities/sale.entity';
import { DeepPartial } from "typeorm";

@Injectable()
export class SaleService {
  repository = SaleEntity;
  
  async createSale(sale: DeepPartial<SaleEntity>): Promise<SaleEntity> {
    try {
      return await this.repository.save(sale);
    } catch (error) {
      throw new HttpException('Create sale error', 500);
    }
  }

  async findAll() {
    try {
      return await this.repository.find();
    } catch (error) {
      throw new HttpException('Find sales error', 500);
    }
  }

  async updateSale(
    saleId: number,
    sale: DeepPartial<SaleEntity>,
  ): Promise<SaleEntity> {
    try {
      const existingSale = await this.repository.findOne({where:{id:saleId}});
      if (!existingSale) {
        throw new HttpException('sale not found', 404);
      }
      Object.assign(existingSale, sale);

      const updatedSale = await this.repository.save(existingSale);
      return updatedSale;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error; 
      }
      throw new HttpException('Update sale error', 500);
    }
  }

  async findByID(saleId: number): Promise<SaleEntity> {
    try {
      const sale = await this.repository.findOne({
        where: {
          id: saleId,
        }
      });
      
      if (!sale) {
        throw new HttpException('Sale not found', 404);
      }
      
      return sale;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error; 
      }
      throw new HttpException('Find sale by id error', 500);
    }
  }
}