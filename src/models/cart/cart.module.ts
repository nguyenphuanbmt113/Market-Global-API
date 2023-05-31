import { Module, forwardRef } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from 'src/common/entities/cart.entity';
import { CartProduct } from 'src/common/entities/cart_product.entity';
import { ProductModule } from '../product/product.module';
import { AuthModule } from '../auth/auth.module';
import { OrderModule } from '../order/order.module';
import { PaymentModule } from '../payment/payment.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, CartProduct]),
    forwardRef(() => ProductModule),
    forwardRef(() => AuthModule),
    forwardRef(() => OrderModule),
    forwardRef(() => PaymentModule),
  ],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
