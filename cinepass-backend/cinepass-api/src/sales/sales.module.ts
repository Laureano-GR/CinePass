import { Module } from '@nestjs/common';
import { SalesController } from './sales.controller';
import { SalesService } from './sales.service';
import { TicketController } from './ticket.controller';
import { PaymentDataController } from './paymentData.controller';
import { IDTypeController } from './IDType.controller';
import { TicketService } from './ticket.service';
import { PaymentDataService } from './paymentData.service';
import { IDTypeService } from './IDType.service';

@Module({
  controllers: [SalesController, TicketController, PaymentDataController,IDTypeController],
  providers: [SalesService, TicketService, PaymentDataService, IDTypeService]
})
export class SalesModule {}
