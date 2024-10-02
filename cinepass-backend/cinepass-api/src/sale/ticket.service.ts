import { HttpException, Injectable } from '@nestjs/common';
import { TicketEntity } from 'src/_entities/ticket.entity';
import { DeepPartial } from "typeorm";

@Injectable()
export class TicketService {
  repository = TicketEntity;
  
  async createTicket(ticket: DeepPartial<TicketEntity>): Promise<TicketEntity> {
    try {
      return await this.repository.save(ticket);
    } catch (error) {
      throw new HttpException('Create ticket error', 500);
    }
  }

  async findAll() {
    try {
      return await this.repository.find();
    } catch (error) {
      throw new HttpException('Find tickets error', 500);
    }
  }

  async updateTicket(
    ticketId: number,
    ticket: DeepPartial<TicketEntity>,
  ): Promise<TicketEntity> {
    try {
      const existingTicket = await this.repository.findOne({where:{id:ticketId}});
      if (!existingTicket) {
        throw new HttpException('Ticket not found', 404);
      }
      Object.assign(existingTicket, ticket);

      const updatedTicket = await this.repository.save(existingTicket);
      return updatedTicket;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error; 
      }
      throw new HttpException('Update ticket error', 500);
    }
  }

  async findByID(ticketId: number): Promise<TicketEntity> {
    try {
      const ticket = await this.repository.findOne({
        where: {
          id: ticketId,
        }
      });
      
      if (!ticket) {
        throw new HttpException('Ticket not found', 404);
      }
      
      return ticket;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error; 
      }
      throw new HttpException('Find ticket by id error', 500);
    }
  }
}