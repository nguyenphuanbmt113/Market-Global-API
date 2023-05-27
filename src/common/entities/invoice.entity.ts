import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { Payment } from './payment.entity';
import { User } from './user.entity';

@Entity('invoices')
export class Invoice extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: true,
  })
  number: string;

  @Column()
  total: number;

  @Column({
    default: new Date(Date.now()),
  })
  date: Date;

  @Column()
  dueDate: Date;

  @Column()
  paymentDate: Date;

  @OneToOne(() => Order, (order) => order.invoice)
  order: Order;

  @OneToOne(() => Payment, (payment) => payment.invoice)
  payment: Payment;

  @ManyToOne(() => User, (user) => user.invoices, {
    eager: false,
  })
  user: User;

  @Column()
  userId: number;
}
