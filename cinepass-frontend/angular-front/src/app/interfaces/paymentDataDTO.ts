import { PaymentMethodI } from "./paymentMethod";

export interface PaymentDataDTO{
  IDNumber: string;
  name: string;
  email: string;
  IDType: number;
  paymentMethod: PaymentMethodI;
}