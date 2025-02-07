import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SaleController } from './sale.controller';
import { SaleService } from './sale.service';
import { TicketController } from './ticket.controller';
import { PaymentDataController } from './paymentData.controller';
import { IDTypeController } from './IDType.controller';
import { TicketService } from './ticket.service';
import { PaymentDataService } from './paymentData.service';
import { IDTypeService } from './IDType.service';
import { SaleEntity } from 'src/_entities/sale.entity';
import { TicketEntity } from 'src/_entities/ticket.entity';
import { PaymentDataEntity } from 'src/_entities/paymentData.entity';
import { IDTypeEntity } from 'src/_entities/IDType.entity';
import { ShowEntity } from 'src/_entities/show.entity';
import { EmailManagerModule } from 'src/email-manager/email-manager.module';


@Module({
  imports: [
    EmailManagerModule,
    TypeOrmModule.forFeature([SaleEntity, TicketEntity, PaymentDataEntity, IDTypeEntity, ShowEntity])
  ],
  controllers: [SaleController, TicketController, PaymentDataController, IDTypeController],
  providers: [SaleService, TicketService, PaymentDataService, IDTypeService]
})
export class SaleModule {}
