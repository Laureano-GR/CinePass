import { PaymentMethodI } from "./paymentMethod";
import { IDTypeI } from "./idType";

export interface PaymentDataI{
  IDNumber: string;
  name: string;
  email: string;
  IDType: IDTypeI;
  paymentMethod: PaymentMethodI;
}