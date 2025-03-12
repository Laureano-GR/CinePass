import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager, DeepPartial } from 'typeorm';
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
    const codigoCompra = `CINEPASS-${sale.id}-${sale.paymentData.IDNumber}`;
    const qrCodeBase64 = await QRCode.toDataURL(codigoCompra);

    // Generar el contenido del email
    const htmlContent = this.generarContenidoEmailVenta(sale, createSaleDto, codigoCompra);

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

    return codigoCompra;
  }

  async createSale(createSaleDto: CreateSaleDTO): Promise<SaleEntity> {
    const { show, ticketsAmount, paymentData, totalPrice } = createSaleDto;

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
          ticket.show = { id: show.id } as any; // Asignar directamente el ID del Show
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

  generarContenidoEmailVenta(sale: SaleEntity, createSaleDto: CreateSaleDTO, codigoCompra: string): string {
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
                    <h2 style="font-family:'Montserrat', sans-serif; color:#E50914; font-size:22px;">¡Gracias por tu compra, ${sale.paymentData.name}!</h2>
                    <p>Has comprado <strong>${sale.ticketsAmount}</strong> entradas para:</p>
                    <table border="0" cellspacing="0" cellpadding="5" style="font-size:16px; margin-bottom: 10px;">
                      <tr><td style="font-weight:bold;">Película:</td><td>${createSaleDto.show.movie.name}</td></tr>
                      <tr><td style="font-weight:bold;">Fecha y Hora:</td><td>${new Date(createSaleDto.show.dateAndTime).toLocaleString()}</td></tr>
                      <tr><td style="font-weight:bold;">Idioma:</td><td>${createSaleDto.show.selectedLanguage.name}</td></tr>
                      <tr><td style="font-weight:bold;">Tipo de función:</td><td>${createSaleDto.show.showType.name}</td></tr>
                      <tr><td style="font-weight:bold;">Sala:</td><td>${createSaleDto.show.room.roomNumber}</td></tr>
                      <tr><td style="font-weight:bold;">Sucursal:</td><td>${createSaleDto.show.subsidiary.name}</td></tr>
                    </table>
                    <p><strong>Código de compra:</strong> ${codigoCompra}</p>
                    <p>Adjuntamos tu QR para ingresar al cine.</p>
                    <div style="text-align:center; margin-top:20px;">
                      <img src="cid:qrcode@cinepass" alt="Código QR" style="max-width:200px; display:block; margin:0 auto;">
                    </div>
                    <p style="margin-top:20px; font-size:14px; text-align:center; color:#999;">
                      Si tienes alguna duda o deseas cancelar esta compra, contáctanos en:
                    </p>
                    <p href="mailto:cinepass2024@gmail.com" style="color:#E50914;  font-size:14px; text-decoration:none; text-align:center;">cinepass2024@gmail.com</p>
                    <p style="color:#E50914; text-decoration:none; text-align:center; font-size:14px;"> +54 9 11 1234-5678  </p>
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

  formatDate(date: string | Date): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0'); // Los meses en JavaScript son 0-indexados
    const year = dateObj.getFullYear();
    const hours = dateObj.getHours().toString().padStart(2, '0');
    const minutes = dateObj.getMinutes().toString().padStart(2, '0');
    return `${day}/${month}/${year} - ${hours}:${minutes}hs`;
  }
}