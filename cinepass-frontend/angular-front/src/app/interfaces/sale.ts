import { PaymentDataI } from "./paymentData";
import { TicketI } from "./ticket";

export interface SaleI {
  id: number;
  dateAndTime: Date;
  description: string;
  ticketsAmount: number;
  totalPrice: number;
  canceled: boolean;
  paymentData: PaymentDataI;
  tickets: TicketI[];
}