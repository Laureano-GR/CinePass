import { IDTypeEntity } from "src/_entities/IDType.entity";
import { PaymentMethodEntity } from "src/_entities/paymentMethod";

export interface PaymentDataDTO {
  IDNumber: string;
  name: string;
  IDType: IDTypeEntity;
  email: string;
  paymentMethod: PaymentMethodEntity;
  cardExpDate: string;
  CVV: string;
  cardNumber: string;
  cardRespName: string;
}