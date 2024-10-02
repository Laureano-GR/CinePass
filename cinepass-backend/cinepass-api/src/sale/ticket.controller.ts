import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
} from '@nestjs/common';
import { TicketEntity } from 'src/_entities/ticket.entity';
import { DeepPartial } from "typeorm";
import { TicketService } from './ticket.service';

@Controller('tickets')
export class TicketController {
  constructor(private service: TicketService) {}
  
    @Post()
    async createTicket(
      @Body() ticket: DeepPartial<TicketEntity>,
    ): Promise<TicketEntity> {
      return await this.service.createTicket(ticket);
    }
  
    @Get()
    async findAll() {
      return await this.service.findAll();
    }
  
    @Put('update/:id')
    async updateTicket(
      @Param('id') id: number,
      @Body() ticket: DeepPartial<TicketEntity>,
    ): Promise<TicketEntity> {
      const updatedTicket= await this.service.updateTicket(id, ticket);
      return updatedTicket;
    }
    
    @Get(':id')
    async findByID(@Param('id') id: number): Promise<TicketEntity> {
      return await this.service.findByID(id);
    }
}