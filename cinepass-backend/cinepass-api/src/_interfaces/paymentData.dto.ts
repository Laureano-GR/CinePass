import { IDTypeEntity } from "src/_entities/IDType.entity";

export class PaymentDataDTO {
  IDNumber: string;
  name: string;
  IDType: IDTypeEntity;
  email: string;
  cardExpDate: string;
  CVV: string;
  cardNumber: string;
  cardRespName: string;
}