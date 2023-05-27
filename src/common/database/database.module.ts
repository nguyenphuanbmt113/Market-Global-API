import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '../entities/role.entity';
import { User } from '../entities/user.entity';
import { PasswordConfirmEntity } from '../entities/passwordConfirm.entity';
import { EmailConfirmEntity } from '../entities/emailConfirm.entity';
import { Product } from '../entities/product.entity';
import { Category } from '../entities/category.entity';
import { SubCategory } from '../entities/sub-category.entity';
import { SubCategoryTag } from '../entities/sub-category-tab.entity';
import { ProductTag } from '../entities/product-tab.entity';
import { Cart } from '../entities/cart.entity';
import { CartProduct } from '../entities/cart_product.entity';
import { Order } from '../entities/order.entity';
import { Invoice } from '../entities/invoice.entity';
import { Payment } from '../entities/payment.entity';
import { OrderItem } from '../entities/order-item.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: configService.get('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB'),
        entities: [
          User,
          Role,
          PasswordConfirmEntity,
          EmailConfirmEntity,
          Product,
          ProductTag,
          Category,
          SubCategory,
          SubCategoryTag,
          Cart,
          CartProduct,
          Order,
          Invoice,
          Payment,
          OrderItem,
        ],
        synchronize: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
