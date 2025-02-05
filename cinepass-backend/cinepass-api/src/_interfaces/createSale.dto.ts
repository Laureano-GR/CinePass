import { IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePaymentDataDTO } from './createPaymentData.dto';

export class CreateSaleDTO {
  @IsNumber()
  showId: number;

  @IsNumber()
  ticketsAmount: number;

  @ValidateNested()
  @Type(() => CreatePaymentDataDTO)
  paymentData: CreatePaymentDataDTO;

  @IsNumber()
  totalPrice: number;
}