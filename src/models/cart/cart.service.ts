import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from 'src/common/entities/cart.entity';
import { CartProduct } from 'src/common/entities/cart_product.entity';
import { User } from 'src/common/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) public readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartProduct)
    private readonly cartProductRepository: Repository<CartProduct>, // @Inject(forwardRef(() => ProductService)) // private productService: ProductService,
  ) {}

  async createCart(user: User): Promise<Cart> {
    const cart = new Cart();
    cart.cartProducts = [];
    cart.user = user;
    cart.totalItems = 0;
    const savedCart = await cart.save();
    return savedCart;
  }

  async getCart(id: number) {
    const queryBuilder = this.cartRepository.createQueryBuilder('cart');
    const cart = await queryBuilder
      .leftJoinAndSelect('cart.cartProducts', 'cartProduct')
      .where({ id })
      .getOne();
    return cart;
  }

  async getTotalCarts() {
    return await this.cartRepository.createQueryBuilder().getCount();
  }

  async getUserCart(user?: User, id?: number): Promise<Cart> {
    let cart = null;
    const query = this.cartRepository.createQueryBuilder('cart');
    if (user) {
      cart = await query
        .leftJoinAndSelect('cart.cartProducts', 'cartProduct')
        .where('cart.id = :id', { id: user.cartId })
        .getOne();
    } else if (id) {
      cart = await query
        .leftJoinAndSelect('cart.cartProducts', 'cartProduct')
        .where('cart.id = :id', { id: id })
        .getOne();
    } else {
      throw new NotFoundException('cart not found');
    }
    return cart;
  }
}
