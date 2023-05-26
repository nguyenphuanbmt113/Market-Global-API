import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { CartProduct } from './cart_product.entity';

@Entity('cart')
export class Cart extends BaseEntity {
  //name: string;
  //quantity: number;
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.cart)
  user: User;

  @Column({
    default: 0,
  })
  totalItems: number;

  @OneToMany(() => CartProduct, (cartProduct) => cartProduct.cart, {
    eager: true,
  })
  cartProducts: CartProduct[];
}
