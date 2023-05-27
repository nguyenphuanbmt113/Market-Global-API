import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderItem } from 'src/common/entities/order-item.entity';
import { Order, OrderStatus } from 'src/common/entities/order.entity';
import { Repository } from 'typeorm';
import { InvoiceService } from '../invoice/invoice.service';
import { PaymentService } from '../payment/payment.service';
import { ProductService } from '../product/product.service';
import { User } from 'src/common/entities/user.entity';
import { CartProduct } from 'src/common/entities/cart_product.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,

    @Inject(forwardRef(() => InvoiceService))
    private invoiceService: InvoiceService,
    private paymentService: PaymentService,
    private productService: ProductService,
  ) {}

  async getAllOrders(): Promise<Order[]> {
    const orders = await this.orderRepository.find();
    // orders = await this.checkOrdersStatus(orders);
    return orders;
  }

  async getTotalOrders() {
    return await this.orderRepository.createQueryBuilder().getCount();
  }

  async getOrderItems(orderId: number) {
    const orderItems = await this.orderItemRepository.find({
      where: {
        orderId,
      },
    });
    return orderItems;
  }

  async createOrder(user: User, createOrderDto: any): Promise<Order> {
    const order = new Order();
    const { billingAddress } = createOrderDto;
    const {
      comments,
      postalCode,
      phone,
      email,
      country,
      city,
      address1,
      address2,
      fullName,
    } = billingAddress;
    order.user = user;
    const today = new Date(Date.now());
    order.orderItems = [];
    order.status = OrderStatus.PROCESSED;
    order.billingAddress = {
      city,
      fullName,
      address2,
      address1,
      country,
      email,
      phone,
      postalCode,
      comments,
    };
    order.shipmentDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 7,
    );
    const savedOrder = await order.save();
    return savedOrder;
  }

  async createOrderItem(
    order: Order,
    cartProduct: CartProduct,
  ): Promise<OrderItem> {
    const product = await this.productService.getProductById(
      cartProduct.productId,
    );
    product.sales += 1;
    product.quantity = product.quantity - cartProduct.quantity;
    await product.save();
    const orderItem = new OrderItem();
    orderItem.order = order;
    orderItem.productId = cartProduct.productId;
    orderItem.unitPrice = cartProduct.totalPrice;
    orderItem.quantity = cartProduct.quantity;
    const savedOrderItem = await orderItem.save();
    return savedOrderItem;
  }
}
