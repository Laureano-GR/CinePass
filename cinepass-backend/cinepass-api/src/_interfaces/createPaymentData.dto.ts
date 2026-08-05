import { Type } from 'class-transformer';
import { IsString, IsEmail, IsNumber, ValidateNested } from 'class-validator';
import { PaymentMethodDTO} from './paymentMethodDTO';

export class CreatePaymentDataDTO {
  @IsString()
  IDNumber: string;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsNumber()
  IDType: number;

  paymentMethod: PaymentMethodDTO;
}