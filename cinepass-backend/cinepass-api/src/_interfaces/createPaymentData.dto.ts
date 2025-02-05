import { IsString, IsEmail, IsNumber } from 'class-validator';

export class CreatePaymentDataDTO {
  @IsString()
  IDNumber: string;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsNumber()
  IDType: number;
}