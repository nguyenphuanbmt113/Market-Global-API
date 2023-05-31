import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from 'src/common/entities/payment.entity';
import { Repository } from 'typeorm';
import { InvoiceService } from '../invoice/invoice.service';
import { User } from 'src/common/entities/user.entity';
import { CreatePaymentDto } from '../cart/dto/create-order.dto';
import { Order } from 'src/common/entities/order.entity';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class PaymentService {
  private stripe: Stripe;
  constructor(
    private configService: ConfigService,
    @InjectRepository(Payment)
    public readonly paymentRepository: Repository<Payment>,
    private invoiceService: InvoiceService,
  ) {
    this.stripe = new Stripe(configService.get('STRIPE_SECRET_KEY'), {
      apiVersion: '2022-11-15',
    });
  }
  async createPayment(
    user: User,
    createPaymentDto: CreatePaymentDto,
    order: Order,
  ) {
    const payment = new Payment();
    const { paymentMethod, stripeData } = createPaymentDto;
    payment.paymentMethod = paymentMethod;
    payment.user = user;
    const invoice = await this.invoiceService.createInvoice(user, order);
    payment.amount = invoice.total;
    payment.invoice = invoice;
    const newPayment = await payment.save();
    const customerId = await this.generatePaymentInvoice(user, stripeData);
    return { payment: newPayment, invoice: invoice, customerId };
  }

  async generatePaymentInvoice(user: User, stripeData) {
    let customer: Stripe.Customer = null;
    if (user.stripeId) {
      customer = (await this.stripe.customers.retrieve(
        user.stripeId,
      )) as Stripe.Customer;
      await this.createInvoice(customer, stripeData);
    } else {
      const params: Stripe.CustomerCreateParams = {
        description: 'test customer',
        email: user.email,
      };
      customer = await this.stripe.customers.create(params);
      user.stripeId = customer.id;
      await this.createInvoice(customer, stripeData);
    }
    return customer.id;
  }

  async createInvoice(customer: Stripe.Customer, stripeData) {
    const { amount, description } = stripeData;
    const invoiceItem = await this.stripe.invoiceItems.create({
      customer: customer.id,
      amount,
      description,
      currency: 'usd',
    });
    await this.stripe.invoices.create({
      collection_method: 'send_invoice',
      days_until_due: 100,
      customer: invoiceItem.customer as string,
    });
  }
}
