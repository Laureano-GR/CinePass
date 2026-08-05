import { SaleI } from './sale';
import { ShowI } from './show';

export interface TicketI {
  id: number;
  ticketXShowNumber: number;
  sale: SaleI;
  show: ShowI;
}
