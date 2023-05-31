import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { OrderService } from '../order/order.service';
import { Invoice } from 'src/common/entities/invoice.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/common/entities/user.entity';
import { Order } from 'src/common/entities/order.entity';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(Invoice)
    public readonly invoiceRepository: Repository<Invoice>,
    @Inject(forwardRef(() => OrderService)) private orderService: OrderService,
  ) {}

  async getAllInvoices(): Promise<Invoice[]> {
    return await this.invoiceRepository.find();
  }

  async getTotalInvoices() {
    return await this.invoiceRepository.createQueryBuilder().getCount();
  }

  async getUserInvoices(user: User): Promise<Invoice[]> {
    return await this.invoiceRepository.find({
      where: {
        userId: user.id,
      },
    });
  }

  async getInvoiceById(id: number): Promise<Invoice> {
    const invoice = await this.invoiceRepository.findOne({
      where: {
        id,
      },
    });
    if (!invoice) {
      throw new NotFoundException('Not found');
    }
    return invoice;
  }
  async createInvoice(user: User, order: Order): Promise<Invoice> {
    const invoice = new Invoice();
    invoice.user = user;
    const today = new Date(Date.now());
    invoice.dueDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 7,
    );
    invoice.paymentDate = today;
    invoice.order = order;
    let totalAmount = 0;
    const orderItems = await this.orderService.getOrderItems(order.id);
    for (let i = 0; i < orderItems.length; i++) {
      totalAmount += orderItems[i].unitPrice;
    }
    invoice.total = totalAmount;
    const newInvoice = await invoice.save();
    return newInvoice;
  }
}
