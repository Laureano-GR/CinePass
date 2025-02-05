import { PaymentDataDTO } from './paymentDataDTO';

export interface CreateSaleDTO {
  showId: number;
  ticketsAmount: number;
  paymentData: PaymentDataDTO;
  totalPrice: number;
}