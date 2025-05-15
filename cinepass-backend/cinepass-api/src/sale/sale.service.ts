import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager, DeepPartial, In } from 'typeorm';
import { SaleEntity } from 'src/_entities/sale.entity';
import { PaymentDataEntity } from 'src/_entities/paymentData.entity';
import { TicketEntity } from 'src/_entities/ticket.entity';
import { ShowEntity } from 'src/_entities/show.entity';
import { CreateSaleDTO } from 'src/_interfaces/createSale.dto';
import * as QRCode from 'qrcode';
import { EmailManagerService } from 'src/email-manager/email-manager.service';
import * as path from 'path';

@Injectable()
export class SaleService {
  constructor(
    private readonly emailManagerService: EmailManagerService,
    @InjectRepository(SaleEntity)
    private readonly saleRepository: Repository<SaleEntity>,
  ) {}

  async processSale(createSaleDto: CreateSaleDTO): Promise<string> {
    const sale = await this.createSale(createSaleDto)
    const purchaseCode = `CINEPASS-${sale.id}-${sale.paymentData.IDNumber}`;
    const qrCodeBase64 = await QRCode.toDataURL(purchaseCode);

    if (createSaleDto.isOnline) {
      // Generar el contenido del email
      const htmlContent = this.generateEmailSalesContent(createSaleDto, purchaseCode);

      // Adjuntos
      const attachments = [
        {
          filename: 'qrcode.png',
          content: qrCodeBase64.split(';base64,').pop(),
          encoding: 'base64',
          cid: 'qrcode@cinepass' // Identificador único para la imagen QR
        },
        {
          filename: 'logo.png',
          path: path.join(__dirname, '..', '..', 'uploads', 'logo.png'),
          cid: 'logo@cinepass' // Identificador único para la imagen del logo
        }
      ];

      await this.emailManagerService.enviarCorreo(sale.paymentData.email, 'Tus entradas para el cine 🎟', htmlContent, attachments);
    } else {
      // Generar ASCII con los datos de la compra
      const asciiReceipt = `
      ==========================================
                      CINEPASS
      ==========================================
      Código de Compra: ${purchaseCode}
      Película: ${createSaleDto.show.movie.name}
      Fecha y Hora: ${new Date(createSaleDto.show.dateAndTime).toLocaleString('es-ES', { hour12: false })}
      Idioma: ${createSaleDto.show.selectedLanguage.name}
      Tipo de Función: ${createSaleDto.show.showType.name}
      Sala: ${createSaleDto.show.room.roomNumber}
      Sucursal: ${createSaleDto.show.subsidiary.name}
      ------------------------------------------
      Cantidad de Entradas: ${createSaleDto.ticketsAmount}
      Importe Total: $${createSaleDto.totalPrice}
      Método de Pago: ${createSaleDto.paymentData.paymentMethod.name}
      ==========================================
      ¡Gracias por tu compra!
      ==========================================
      `;

      return asciiReceipt; // Retorna el ASCII como resultado
    }
    
    return purchaseCode;
  }

  async createSale(createSaleDto: CreateSaleDTO): Promise<SaleEntity> {
    const existingShow = createSaleDto.show
    const { ticketsAmount, paymentData, totalPrice } = createSaleDto;

    return await this.saleRepository.manager.transaction(async (manager: EntityManager) => {
      try {
        const paymentDataEntity = new PaymentDataEntity();
        paymentDataEntity.paymentMethod = { id: paymentData.paymentMethod.id } as any; // Asignar directamente el ID del PaymentData
        paymentDataEntity.IDNumber = paymentData.IDNumber;
        paymentDataEntity.name = paymentData.name;
        paymentDataEntity.email = paymentData.email;
        paymentDataEntity.IDType = { id: paymentData.IDType } as any; // Asignar directamente el ID del IDType

        // Crear datos de pago
        const savedPaymentData = await manager.save(PaymentDataEntity, paymentDataEntity);

        //Manejo previo a la creacion de tickets
        const existingTicketNumbers = existingShow.tickets.map(ticket => ticket.ticketXShowNumber); // Obtén los números de tickets existentes
        const maxTicketNumber = Math.max(0, ...existingTicketNumbers); // Encuentra el número más alto
        const availableNumbers = [];

        // Encuentra los números faltantes (disponibles para reutilizar)
        for (let i = 1; i <= maxTicketNumber; i++) {
          if (!existingTicketNumbers.includes(i)) {
            availableNumbers.push(i);
          }
        }

        // Crear tickets
        const tickets = [];
        for (let i = 0; i < ticketsAmount; i++) {
          const ticket = new TicketEntity();
          ticket.show = { id: existingShow.id } as any; // Asignar directamente el ID del Show

          // Asignar un número de ticket reutilizable o consecutivo
          if (availableNumbers.length > 0) {
            ticket.ticketXShowNumber = availableNumbers.shift(); // Usa un número disponible
          } else {
            ticket.ticketXShowNumber = maxTicketNumber + 1 + i; // Usa un número consecutivo
          }

          tickets.push(ticket);
        }

        const savedTickets = await manager.save(TicketEntity, tickets);

        // Crear venta
        const sale = new SaleEntity();
        sale.dateAndTime = new Date();
        sale.paymentData = savedPaymentData;
        sale.show = existingShow;
        sale.tickets = savedTickets;
        sale.ticketsAmount = ticketsAmount;
        sale.totalPrice = totalPrice;
        sale.canceled = false;

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
        relations:['paymentData','tickets', 'paymentData.paymentMethod', 'paymentData.IDType', 'show']
      });
    } catch (error) {
      throw new HttpException('Find sales error', 500);
    }
  }

  async findSales(purchaseId?: number, documentNumber?: string, date?: string): Promise<SaleEntity[]> {
    try {
      const query = this.saleRepository.createQueryBuilder('sale')
        .leftJoinAndSelect('sale.paymentData', 'paymentData')
        .leftJoinAndSelect('sale.tickets', 'tickets')
        .leftJoinAndSelect('sale.show', 'show')
        .leftJoinAndSelect('paymentData.paymentMethod', 'paymentMethod')
        .leftJoinAndSelect('paymentData.IDType', 'IDType');

      if (purchaseId) {
        query.andWhere('sale.id = :purchaseId', { purchaseId });
      }
      if (documentNumber) {
        query.andWhere('paymentData.IDNumber = :documentNumber', { documentNumber });
      }
      if (date) {
        query.andWhere('DATE(sale.dateAndTime) = :date', { date });
      }

      return await query.getMany();
    } catch (error) {
      console.error('Error finding sales:', error);
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
        relations:['paymentData','tickets', 'paymentData.paymentMethod', 'paymentData.IDType', 'show']
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
  
  generateEmailSalesContent(createSaleDto: CreateSaleDTO, purchaseCode: string): string {
    return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <title>Confirmación de Compra - CinePass</title>
    </head>
    <body style="margin:0; padding:0; background-color:#ffffff; font-family:Roboto, sans-serif; color:#333333;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#ffffff; padding:20px 0;">
        <tr>
          <td align="center">
            <table width="600" border="0" cellspacing="0" cellpadding="20" style="border: 1px solid #ddd; border-radius: 8px; overflow:hidden; font-family:Roboto, sans-serif;">

              <tr>
                <td style="background-color:#333333; text-align:center; padding: 20px;">
                  <img src="cid:logo@cinepass" alt="CinePass Logo" style="max-width:150px;">
                </td>
              </tr>

              <tr>
                <td style="text-align:left; padding: 20px; font-size:16px; line-height:1.5;">
                  <h2 style="font-family:'Montserrat', sans-serif; color:#E50914; font-size:22px; text-align:center;">¡Gracias por tu compra, ${createSaleDto.paymentData.name}!</h2>
                  
                  <p style="text-align:center; font-size:18px;"><strong>Detalles de tu compra</strong></p>

                  <hr style="border: 1px solid #ddd; margin: 10px 0;">


                  <table width="100%" border="0" cellspacing="0" cellpadding="8" style="font-size:16px;">
                    <tr>
                      <td style="font-weight:bold; width: 50%;">Película:</td>
                      <td>${createSaleDto.show.movie.name}</td>
                    </tr>
                    <tr>
                      <td style="font-weight:bold;">Fecha y Hora:</td>
                      <td>${new Date(createSaleDto.show.dateAndTime).toLocaleString('es-ES', { hour12: false })}</td>
                    </tr>
                    <tr>
                      <td style="font-weight:bold;">Idioma:</td>
                      <td>${createSaleDto.show.selectedLanguage.name}</td>
                    </tr>
                    <tr>
                      <td style="font-weight:bold;">Tipo de función:</td>
                      <td>${createSaleDto.show.showType.name}</td>
                    </tr>
                    <tr>
                      <td style="font-weight:bold;">Sala:</td>
                      <td>${createSaleDto.show.room.roomNumber}</td>
                    </tr>
                    <tr>
                      <td style="font-weight:bold;">Sucursal:</td>
                      <td>${createSaleDto.show.subsidiary.name}</td>
                    </tr>
                  </table>

                  <hr style="border: 1px solid #ddd; margin: 10px 0;">

                  <p style="font-size:16px;"><strong>Cantidad de entradas:</strong> ${createSaleDto.ticketsAmount}</p>
                  <p style="font-size:16px;"><strong>Importe total:</strong> $${createSaleDto.totalPrice}</p>
                  <p style="font-size:16px;"><strong>Método de pago:</strong> ${createSaleDto.paymentData.paymentMethod.name}</p>
                  <p style="font-size:16px;"><strong>Código de compra:</strong> ${purchaseCode}</p>

                  <hr style="border: 1px solid #ddd; margin: 10px 0;">

                  <p style="text-align:center;">Adjuntamos tu QR para ingresar al cine.</p>
                  <div style="text-align:center; margin-top:20px;">
                    <img src="cid:qrcode@cinepass" alt="Código QR" style="max-width:200px; display:block; margin:0 auto;">
                  </div>


                  <p style="text-align:center; margin-top:20px;">
                    <span style=" font-size:14px; text-align:center; color:#999;">
                    Si tienes alguna duda o deseas cancelar esta compra, contáctanos en:
                    </span>
                    <a href="mailto:cinepass2024@gmail.com" style="color:#E50914; font-size:14px; text-decoration:none;">cinepass2024@gmail.com</a><br>
                    <span style="color:#E50914; font-size:14px;"> +54 9 11 1234-5678</span>
                    
                  </p>
                </td>
              </tr>

              <tr>
                <td style="background-color:#333333; text-align:center; padding: 10px;">
                  <p style="margin:0; font-size:14px; color:#ffffff;">© 2024 CinePass. Todos los derechos reservados.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `;
  }
  /*
  formatDate(date: string | Date): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0'); // Los meses en JavaScript son 0-indexados
    const year = dateObj.getFullYear();
    const hours = dateObj.getHours().toString().padStart(2, '0');
    const minutes = dateObj.getMinutes().toString().padStart(2, '0');
    return `${day}/${month}/${year} - ${hours}:${minutes}hs`;
  }
  */
  cancelSale(saleId: number): Promise<SaleEntity> {
    return this.saleRepository.manager.transaction(async (manager: EntityManager) => {
      try {
        // Buscar la venta por ID
        const sale = await manager.findOne(SaleEntity, {
          where: { id: saleId },
          relations: ['tickets'], // Incluir los tickets relacionados
        });
  
        if (!sale) {
          throw new HttpException('Sale not found', 404);
        }
  
        // Eliminar los tickets relacionados
        if (sale.tickets && sale.tickets.length > 0) {
          await manager.delete(TicketEntity, { id: In(sale.tickets.map(ticket => ticket.id)) });
        }
  
        // Actualizar el estado de la venta a cancelado
        sale.canceled = true;
  
        return await manager.save(SaleEntity, sale);
      } catch (error) {
        console.error('Error canceling sale:', error);
        throw new HttpException('Cancel sale error', 500);
      }
    });
  }
}