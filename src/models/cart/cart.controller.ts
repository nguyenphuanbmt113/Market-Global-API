import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserDeco } from '../auth/decorator/user.decorator';
import { User } from 'src/common/entities/user.entity';
import { CartService } from './cart.service';
import { AuthenticationGuard } from '../auth/guards/jwt-guards.guard';
import { RolesGuard } from '../auth/guards/role.guard';
import { UserRole } from 'src/common/entities/role.entity';
import { Roles } from '../auth/decorator/role.decorator';
import { RemoveCartItem } from 'src/common/interface/global.interface';
@UseGuards(AuthenticationGuard, RolesGuard)
@Roles(UserRole.User)
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

  @Delete('clear-cart')
  clearCart(@UserDeco() user: User) {
    return this.cartService.clearCart(null, user.cartId, true);
  }

  @Delete('remove-products-from-cart')
  removeProductsFromCart(
    @UserDeco() user: User,
    @Body('cartProducts') cartProducts: RemoveCartItem[],
  ) {
    return this.cartService.removeProductsFromCart(
      user.cartId,
      cartProducts,
      true,
    );
  }

  @Delete(':cartId/remove-product-from-cart/:cartProductId')
  removeCartProductFromCart(
    @Param('cartId') cartId: number,
    @Param('cartProductId') cartProductId: number,
  ) {
    return this.cartService.removeCartProduct(cartId, cartProductId);
  }

  @Put(':cartId/update-product-cart-quantity/:cartProductId')
  updateCartProductQuantity(
    @Param('cartId') cartId: number,
    @Param('cartProductId') cartProductId: number,
    @Query('newQuantity') newQuantity: number,
  ) {
    return this.cartService.updateCartProductQuantity(
      cartId,
      cartProductId,
      newQuantity,
    );
  }

  // @Post('checkout-on-cart')
  // checkoutOnCart(
  //   @UserDeco() user: User,
  //   @Body('createOrderDto') createOrderDto: any,
  //   @Body('createPaymentDto') createPaymentDto: any,
  // ) {
  //   return this.cartService.checkoutOnCart(
  //     user,
  //     createOrderDto,
  //     createPaymentDto,
  //   );
  // }

  // @Post('checkout-on-single-product/:cartProductId')
  // checkoutOnSingleProduct(
  //   @UserDeco() user: User,
  //   @Param('cartProductId') cartProductId: number,
  //   @Body('createOrderDto') createOrderDto: any,
  //   @Body('createPaymentDto') createPaymentDto: any,
  // ) {
  //   return this.cartService.checkoutOnSingleProduct(
  //     user,
  //     cartProductId,
  //     createOrderDto,
  //     createPaymentDto,
  //   );
  // }
}
