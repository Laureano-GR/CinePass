import { Module } from '@nestjs/common';
import { SaleController } from './sale.controller';
import { SaleService } from './sale.service';
import { TicketController } from './ticket.controller';
import { PaymentDataController } from './paymentData.controller';
import { IDTypeController } from './IDType.controller';
import { TicketService } from './ticket.service';
import { PaymentDataService } from './paymentData.service';
import { IDTypeService } from './IDType.service';

@Module({
  controllers: [SaleController, TicketController, PaymentDataController,IDTypeController],
  providers: [SaleService, TicketService, PaymentDataService, IDTypeService]
})
export class SaleModule {}
