import { Column, Entity, ManyToOne } from 'typeorm';
import { Cart } from './cart.entity';
import { AbstractProduct } from '../classes/abstract-product';
import { Product } from './product.entity';

@Entity('cart-product')
export class CartProduct extends AbstractProduct {
  @Column()
  image: string;

  @ManyToOne(() => Cart, (cart) => cart.cartProducts, {
    eager: false,
  })
  cart: Cart;

  @ManyToOne(() => Product, (cart) => cart.cartProducts, {
    eager: false,
  })
  product: Product;

  @Column('float', {
    default: 0.0,
  })
  totalPrice: number;

  @Column('int', {
    nullable: true,
  })
  maxPush: number;

  @Column()
  cartId: number;

  @Column()
  productId: number;
}
