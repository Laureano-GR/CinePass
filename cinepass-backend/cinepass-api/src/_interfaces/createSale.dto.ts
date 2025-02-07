import { IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePaymentDataDTO } from './createPaymentData.dto';
import { ShowEntity } from 'src/_entities/show.entity';

export class CreateSaleDTO {
  @ValidateNested()
  @Type(() => ShowEntity)
  show: ShowEntity;

  @IsNumber()
  ticketsAmount: number;

  @ValidateNested()
  @Type(() => CreatePaymentDataDTO)
  paymentData: CreatePaymentDataDTO;

  @IsNumber()
  totalPrice: number;
}