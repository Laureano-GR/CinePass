import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
} from '@nestjs/common';
import { AddressEntity } from 'src/_entities/address.entity';
import { DeepPartial } from "typeorm";
import { AddressService } from "./address.service";

@Controller('addresses')
export class AddressController {
  constructor(private service: AddressService) {}
  
    @Post()
    async createAddress(
      @Body() address: DeepPartial<AddressEntity>,
    ): Promise<AddressEntity> {
      return await this.service.createAddress(address);
    }
  
    @Get()
    async findAll() {
      return await this.service.findAll();
    }
  
    @Put('update/:id')
    async updateAddress(
      @Param('id') id: number,
      @Body() address: DeepPartial<AddressEntity>,
    ): Promise<AddressEntity> {
      const updatedAddress = await this.service.updateAddress(id, address);
      return updatedAddress;
    }
    
    @Get(':id')
    async findByID(@Param('id') id: number): Promise<AddressEntity> {
      return await this.service.findByID(id);
    }
  }
