export interface CreateSaleDTO {
  date: Date,
  paymentDataId: number,
  ticketIds: number[],
  ticketAmount: number,
  totalPrice: number,
}