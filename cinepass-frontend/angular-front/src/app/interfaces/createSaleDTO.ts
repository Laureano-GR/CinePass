import { PaymentDataDTO } from './paymentDataDTO';
import { ShowI } from './show';

export interface CreateSaleDTO {
  show: ShowI;
  ticketsAmount: number;
  paymentData: PaymentDataDTO;
  totalPrice: number;
}