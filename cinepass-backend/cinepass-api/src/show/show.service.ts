import { HttpException, Injectable } from '@nestjs/common';
import { ShowEntity } from 'src/_entities/show.entity';
import { TicketEntity } from 'src/_entities/ticket.entity';
import { TicketService } from 'src/sale/ticket.service';
import { DeepPartial, Repository } from "typeorm";
import { MovieEntity } from 'src/_entities/movie.entity';
import { ShowTypeEntity } from 'src/_entities/showType.entity';
import { LanguageEntity } from 'src/_entities/language.entity';
import { RoomEntity } from 'src/_entities/room.entity';
import { SubsidiaryEntity } from 'src/_entities/subsidiary.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateShowDto } from 'src/_interfaces/createShowDTO';
import { UpdateShowDto } from 'src/_interfaces/updateShowDTO';

@Injectable()
export class ShowService {
  //repository = ShowEntity;
   
 //Se deberían inyectar o disponer métodos para obtener las entidades relacionadas.
 //Por ejemplo, mediante inyección de repositorios:
 constructor(
   @InjectRepository(ShowEntity) private showRepo: Repository<ShowEntity>,
   @InjectRepository(MovieEntity) private movieRepo: Repository<MovieEntity>,
   @InjectRepository(ShowTypeEntity) private showTypeRepo: Repository<ShowTypeEntity>,
   @InjectRepository(LanguageEntity) private languageRepo: Repository<LanguageEntity>,
   @InjectRepository(RoomEntity) private roomRepo: Repository<RoomEntity>,
   @InjectRepository(SubsidiaryEntity) private subsidiaryRepo: Repository<SubsidiaryEntity>,
   private ticketService: TicketService, 
  ) {}
  
  async createShow(createShowDto: CreateShowDto): Promise<ShowEntity> {
    try {
      // Obtener las entidades relacionables
      const movie = await this.movieRepo.findOne({ where: { id: createShowDto.movie } });
      const showType = await this.showTypeRepo.findOne({ where: { id: createShowDto.showType } });
      const language = await this.languageRepo.findOne({ where: { id: createShowDto.selectedLanguage } });
      const room = await this.roomRepo.findOne({ where: { id: createShowDto.room } });
      const subsidiary = await this.subsidiaryRepo.findOne({ where: { id: createShowDto.subsidiary } });

      if (!movie || !showType || !language || !room || !subsidiary) {
        throw new HttpException('Invalid relationship IDs', 400);
      }

      // Se asume que la fecha ya llega correctamente en UTC
      const timestamp = new Date(createShowDto.dateAndTime);

      // Crear la nueva función asignando las relaciones obtenidas
      const newShow = this.showRepo.create({
        dateAndTime: timestamp,
        movie: movie,
        showType: showType,
        selectedLanguage: language,
        room: room,
        subsidiary: subsidiary,
        tickets: [],
      });

      return await this.showRepo.save(newShow);
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
      await this.showRepo.save(show);

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
      return await this.showRepo.find({relations: ['movie','selectedLanguage','showType','room','subsidiary']});
    } catch (error) {
      throw new HttpException('Find shows error', 500);
    }
  }

  async updateShow(
    showId: number,
    updateShowDto: UpdateShowDto,
  ): Promise<ShowEntity> {
    try {
      // Buscar la función existente
      const existingShow = await this.showRepo.findOne({ where: { id: showId } });
      if (!existingShow) {
        throw new HttpException('Show not found', 404);
      }

      // Actualizar la fecha si viene en el DTO (asumida en UTC)
      if (updateShowDto.dateAndTime) {
        existingShow.dateAndTime = new Date(updateShowDto.dateAndTime);
      }

      // Actualizar relaciones si vienen en el DTO
      if (updateShowDto.movie) {
        const movie = await this.movieRepo.findOne({ where: { id: updateShowDto.movie } });
        if (!movie) {
          throw new HttpException('Movie not found', 404);
        }
        existingShow.movie = movie;
      }
      
      if (updateShowDto.showType) {
        const showType = await this.showTypeRepo.findOne({ where: { id: updateShowDto.showType } });
        if (!showType) {
          throw new HttpException('Show type not found', 404);
        }
        existingShow.showType = showType;
      }
      
      if (updateShowDto.selectedLanguage) {
        const language = await this.languageRepo.findOne({ where: { id: updateShowDto.selectedLanguage } });
        if (!language) {
          throw new HttpException('Language not found', 404);
        }
        existingShow.selectedLanguage = language;
      }
      
      if (updateShowDto.room) {
        const room = await this.roomRepo.findOne({ where: { id: updateShowDto.room } });
        if (!room) {
          throw new HttpException('Room not found', 404);
        }
        existingShow.room = room;
      }
      
      if (updateShowDto.subsidiary) {
        const subsidiary = await this.subsidiaryRepo.findOne({ where: { id: updateShowDto.subsidiary } });
        if (!subsidiary) {
          throw new HttpException('Subsidiary not found', 404);
        }
        existingShow.subsidiary = subsidiary;
      }

      const updatedShow = await this.showRepo.save(existingShow);
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
      const show = await this.showRepo.findOne({
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
      const shows = await this.showRepo.find({
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