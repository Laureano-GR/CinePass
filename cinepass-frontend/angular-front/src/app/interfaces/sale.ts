import { PaymentDataI } from "./paymentData";
import { ShowI } from "./show";
import { TicketI } from "./ticket";

export interface SaleI {
  id: number;
  dateAndTime: Date;
  description: string;
  ticketsAmount: number;
  totalPrice: number;
  canceled: boolean;
  paymentData: PaymentDataI;
  show: ShowI
  tickets: TicketI[];
}