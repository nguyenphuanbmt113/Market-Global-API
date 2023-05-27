import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Invoice } from './invoice.entity';
export enum PaymentMethod {
  MASTERCARD = 'MASTERCARD',
  VISA = 'VISA',
  PAYPAL = 'PAYPAL',
  CASH_ON_DELIVERY = 'CASH_ON_DELIVERY',
}

@Entity('payments')
export class Payment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    default: new Date(Date.now()),
  })
  date: Date;

  @Column()
  amount: number;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
  })
  paymentMethod: PaymentMethod;

  @ManyToOne(() => User, (user) => user.payments, {
    eager: false,
  })
  user: User;

  @OneToOne(() => Invoice, (invoice) => invoice.payment, {
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
