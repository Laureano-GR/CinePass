import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
} from '@nestjs/common';
import { ShowEntity } from 'src/_entities/show.entity';
import { DeepPartial } from "typeorm";
import { ShowService } from './show.service';
import { HttpException } from '@nestjs/common';
import { CreateShowDto } from 'src/_interfaces/createShowDTO';
import { UpdateShowDto } from 'src/_interfaces/updateShowDTO';

@Controller('shows')
export class ShowController {
  constructor(private service: ShowService) {}
  
    @Post()
    async createShow(
      @Body() show: CreateShowDto,
    ): Promise<ShowEntity> {
      return await this.service.createShow(show);
    }
  
    @Get()
    async findAll() {
      return await this.service.findAll();
    }
  
    @Put('update/:id')
    async updateShow(
      @Param('id') id: number,
      @Body() show: UpdateShowDto,
    ): Promise<ShowEntity> {
      const updatedShow = await this.service.updateShow(id, show);
      return updatedShow;
    }
    
    @Get(':id')
    async findByID(@Param('id') id: number): Promise<ShowEntity> {
      return await this.service.findByID(id);
    }

    @Get('filter-shows/:movieId/:subsidiaryId')
    async findByMovieAndSubsidary(@Param('movieId') movieId: number, @Param('subsidiaryId') subsidiaryId: number): Promise<ShowEntity[]> {
      return await this.service.findByMovieAndSubsidary(movieId, subsidiaryId);
    }

  @Post(':id/create-tickets')
  async createTicketsForShow(
    @Param('id') id: number,
    @Body('ticketAmount') ticketAmount: number
  ): Promise<number[]> {
    if (!ticketAmount || ticketAmount <= 0) {
      throw new HttpException('Invalid ticket amount', 400);
    }
    return await this.service.createTicketsForShow(id, ticketAmount);
  }
    
}
