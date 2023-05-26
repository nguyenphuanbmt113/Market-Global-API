import { Controller, Get, Post } from '@nestjs/common';
import { UserDeco } from '../auth/decorator/user.decorator';
import { User } from 'src/common/entities/user.entity';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @Post('create-user-cart')
  createUserCart(@UserDeco() user: User) {
    return this.cartService.createCart(user);
  }

  @Get('count')
  getTotalCarts() {
    return this.cartService.getTotalCarts();
  }

  @Get('user-cart')
  getUserCart(@UserDeco() user: User) {
    return this.cartService.getUserCart(user);
  }
}
