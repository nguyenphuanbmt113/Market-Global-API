import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderItem } from './order-item.entity';
import { User } from './user.entity';
import { Invoice } from './invoice.entity';
import { BillingAddress } from '../interface/global.interface';
export enum OrderStatus {
  PROCESSED = 'PROCESSED',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
}

@Entity('orders')
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: OrderStatus,
  })
  status: OrderStatus;

  @Column({ default: new Date(Date.now()) })
  createdAt: Date;

  @Column({
    nullable: true,
  })
  updatedAt: Date;

  @Column('simple-json')
  billingAddress: BillingAddress;

  @Column()
  shipmentDate: Date;

  @ManyToOne(() => User, (user) => user.orders, {
    eager: false,
  })
  user: User;

  @OneToMany(() => OrderItem, (orderItem: OrderItem) => orderItem.order, {
    eager: true,
  })
  orderItems: OrderItem[];

  @OneToOne(() => Invoice, (invoice) => invoice.order, {
    eager: true,
  })
  @JoinColumn()
  invoice: Invoice;

  @Column()
  userId: number;

  @Column({
    nullable: true,
  })
  invoiceId: number;
}
