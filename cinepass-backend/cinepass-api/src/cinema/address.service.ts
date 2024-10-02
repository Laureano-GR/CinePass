import { HttpException, Injectable } from '@nestjs/common';
import { DeepPartial } from 'typeorm';
import { AddressEntity } from '../_entities/address.entity'; ;

@Injectable()
export class AddressService {
  repository = AddressEntity;

  async createAddress(address: DeepPartial<AddressEntity>): Promise<AddressEntity> {
    try {
      return await this.repository.save(address);
    } catch (error) {
      throw new HttpException('Create address error', 500);
    }
  }

  async findAll() {
    try {
      return await this.repository.find();
    } catch (error) {
      throw new HttpException('Find addresses error', 500);
    }
  }

  async updateAddress(
    addressId: number,
    address: DeepPartial<AddressEntity>,
  ): Promise<AddressEntity> {
    try {
      const existingAddress = await this.repository.findOne({where:{id:addressId}});
      if (!existingAddress) {
        throw new HttpException('Address not found', 404);
      }
      Object.assign(existingAddress, address);

      const updatedAddress = await this.repository.save(existingAddress);
      return updatedAddress;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error; 
      }
      throw new HttpException('Update address error', 500);
    }
  }

  async findByID(addressId: number): Promise<AddressEntity> {
    try {
      const address = await this.repository.findOne({
        where: {
          id: addressId,
        }});
      
      if (!address) {
        throw new HttpException('Address not found', 404);
      }
      
      return address;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error; 
      }
      throw new HttpException('Find address by id error', 500);
    }
  } 
}