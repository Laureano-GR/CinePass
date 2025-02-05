import { HttpException, Injectable } from '@nestjs/common';
import { ShowEntity } from 'src/_entities/show.entity';
import { TicketEntity } from 'src/_entities/ticket.entity';
import { TicketService } from 'src/sale/ticket.service';
import { DeepPartial } from "typeorm";

@Injectable()
export class ShowService {
  repository = ShowEntity;
  ticketService: TicketService;
  
  async createShow(show: DeepPartial<ShowEntity>): Promise<ShowEntity> {
    try {
      return await this.repository.save(show);
    } catch (error) {
      throw new HttpException('Create show error', 500);
    }
  }

  async createTicketsForShow(showId: number, ticketAmount: number): Promise<number[]> {
    try {
      const show = await this.findByID(showId);

      if (!show) {
        throw new HttpException('Show not found', 404);
      }

      const newTickets: TicketEntity[] = [];
      for (let i = 0; i < ticketAmount; i++) {
        const ticket = new TicketEntity();
        ticket.show = show;
        newTickets.push(ticket);
      }

      const savedTickets = await this.ticketService.createTickets(newTickets);
      show.tickets.push(...savedTickets);
      await this.repository.save(show);

      return savedTickets.map(ticket => ticket.id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Error creating tickets', 500);
    }
  }

  async findAll() {
    try {
      return await this.repository.find({relations: ['movie','selectedLanguage','showType','room','subsidiary']});
    } catch (error) {
      throw new HttpException('Find shows error', 500);
    }
  }

  async updateShow(
    showId: number,
    show: DeepPartial<ShowEntity>,
  ): Promise<ShowEntity> {
    try {
      const existingShow = await this.repository.findOne({where:{id:showId}});
      if (!existingShow) {
        throw new HttpException('Show not found', 404);
      }
      Object.assign(existingShow, show);

      const updatedShow = await this.repository.save(existingShow);
      return updatedShow;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error; 
      }
      throw new HttpException('Update show error', 500);
    }
  }

  async findByID(showId: number): Promise<ShowEntity> {
    try {
      const show = await this.repository.findOne({
        where: {
          id: showId,
        },
        relations: ['movie','selectedLanguage','showType','room','subsidiary', 'tickets']
      });
      
      if (!show) {
        throw new HttpException('Show not found', 404);
      }
      
      return show;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error; 
      }
      throw new HttpException('Find show by id error', 500);
    }
  }

  async findByMovieAndSubsidary(movieId: number, subsidiaryId: number): Promise<ShowEntity[]> {
    try {
      const shows = await this.repository.find({
        where: {
          movie: { id: movieId },
          subsidiary: { id: subsidiaryId },
        },
        relations: ['movie', 'subsidiary', 'room', 'showType', 'selectedLanguage'],
      });

      if (!shows) {
        throw new HttpException('Shows not found', 404);
      }

      return shows;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Find show by movie and subsidiary error', 500);
    }
  }
}