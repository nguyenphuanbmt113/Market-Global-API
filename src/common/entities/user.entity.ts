import { InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IsBoolean, IsEmail, IsString } from 'class-validator';
import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import BaseClassEntity from './global/base-entity.entity';
import { Role } from './role.entity';
import { Cart } from './cart.entity';
import { Invoice } from './invoice.entity';
import { Payment } from './payment.entity';
import { Order } from './order.entity';

@Entity()
export class User extends BaseClassEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsString()
  firstName: string;

  @Column()
  @IsString()
  lastName: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column({ select: false })
  @IsString()
  password: string;

  @Column({ default: false })
  @IsBoolean()
  verifiedEmail: boolean;

  @Column({ nullable: true })
  refresh_token: string;

  @Column({ nullable: true })
  @IsString()
  avatar: string;

  @OneToMany(() => Role, (role) => role.user, { eager: true })
  roles: Role[];

  @OneToOne(() => Cart, (cart) => cart.user)
  @JoinColumn()
  cart?: Cart;

  @Column({
    nullable: true,
  })
  cartId?: number;

  @OneToMany(() => Invoice, (invoice) => invoice.user, {
    eager: true,
  })
  invoices?: Invoice[];

  @OneToMany(() => Payment, (payment) => payment.user, {
    eager: true,
  })
  payments?: Payment[];

  @OneToMany(() => Order, (order) => order.user, {
    eager: true,
  })
  orders?: Order[];

  @Column({
    nullable: true,
  })
  stripeId?: string;

  // ===== Inverse side Relation =====

  // ===== Security =====
  @BeforeInsert()
  // @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password) {
      try {
        const saltOrRounds = 10;
        this.password = await bcrypt.hash(this.password, saltOrRounds);
      } catch (e) {
        console.log(e);
        throw new InternalServerErrorException();
      }
    }
  }

  // ===== Methods =====
  async checkPassword(aPassword: string): Promise<boolean> {
    try {
      const ok = await bcrypt.compare(aPassword, this.password);
      return ok;
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }
}
