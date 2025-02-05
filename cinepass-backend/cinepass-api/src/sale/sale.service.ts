import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager, DeepPartial } from 'typeorm';
import { SaleEntity } from 'src/_entities/sale.entity';
import { PaymentDataEntity } from 'src/_entities/paymentData.entity';
import { TicketEntity } from 'src/_entities/ticket.entity';
import { ShowEntity } from 'src/_entities/show.entity';
import { CreateSaleDTO } from 'src/_interfaces/createSale.dto';

@Injectable()
export class SaleService {
  constructor(
    @InjectRepository(SaleEntity)
    private readonly saleRepository: Repository<SaleEntity>,
    @InjectRepository(PaymentDataEntity)
    private readonly paymentDataRepository: Repository<PaymentDataEntity>,
    @InjectRepository(TicketEntity)
    private readonly ticketRepository: Repository<TicketEntity>,
    @InjectRepository(ShowEntity)
    private readonly showRepository: Repository<ShowEntity>,
  ) {}

  async createSale(createSaleDto: CreateSaleDTO): Promise<SaleEntity> {
    const { showId, ticketsAmount, paymentData, totalPrice } = createSaleDto;

    return await this.saleRepository.manager.transaction(async (manager: EntityManager) => {
      try {
        const paymentDataEntity = new PaymentDataEntity();
        paymentDataEntity.IDNumber = paymentData.IDNumber;
        paymentDataEntity.name = paymentData.name;
        paymentDataEntity.email = paymentData.email;
        paymentDataEntity.IDType = { id: paymentData.IDType } as any; // Asignar directamente el ID del IDType

        // Crear datos de pago
        const savedPaymentData = await manager.save(PaymentDataEntity, paymentDataEntity);

        // Crear tickets
        const tickets = [];
        for (let i = 0; i < ticketsAmount; i++) {
          const ticket = new TicketEntity();
          ticket.show = { id: showId } as any; // Asignar directamente el ID del Show
          ticket.ticketXShowNumber = i + 1; // Asignar un número de ticket
          tickets.push(ticket);
        }
        const savedTickets = await manager.save(TicketEntity, tickets);

        // Crear venta
        const sale = new SaleEntity();
        sale.dateAndTime = new Date();
        sale.paymentData = savedPaymentData;
        sale.tickets = savedTickets;
        sale.ticketsAmount = ticketsAmount;
        sale.totalPrice = totalPrice;

        return await manager.save(SaleEntity, sale);
      } catch (error) {
        console.error(error); // Agrega esto para ver el error en la consola
        throw new HttpException(`Create sale error: ${error.message}`, 500);
      }
    });
  }

  async findAll() {
    try {
      return await this.saleRepository.find({
        relations:['paymentData','tickets']
      });
    } catch (error) {
      throw new HttpException('Find sales error', 500);
    }
  }

  async updateSale(
    saleId: number,
    sale: DeepPartial<SaleEntity>,
  ): Promise<SaleEntity> {
    try {
      const existingSale = await this.saleRepository.findOne({where:{id:saleId}});
      if (!existingSale) {
        throw new HttpException('sale not found', 404);
      }
      Object.assign(existingSale, sale);

      const updatedSale = await this.saleRepository.save(existingSale);
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
      const sale = await this.saleRepository.findOne({
        where: {
          id: saleId,
        },
        relations:['paymentData','tickets']
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

  