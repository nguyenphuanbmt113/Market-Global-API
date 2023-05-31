import { PaymentMethod } from 'src/common/entities/payment.entity';
import { BillingAddress } from 'src/common/interface/global.interface';

export class OrderDto {
  billingAddress: BillingAddress;
}

export class CreatePaymentDto {
  paymentMethod: PaymentMethod;

  stripeData: {
    amount: number;
    source: any;
    description: string;
  };
}
