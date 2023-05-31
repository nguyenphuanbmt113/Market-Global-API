import * as Joi from '@hapi/joi';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './common/database/database.module';
import { AuthModule } from './models/auth/auth.module';
import { RoleModule } from './models/role/role.module';
import { CategoryModule } from './models/category/category.module';
import { SubCategoryModule } from './models/sub_category/sub_category.module';
import { ProductModule } from './models/product/product.module';
import { TagModule } from './models/tag/tag.module';
import { CartModule } from './models/cart/cart.module';
import { OrderModule } from './models/order/order.module';
import { PaymentModule } from './models/payment/payment.module';
import { InvoiceModule } from './models/invoice/invoice.module';
import { MulterModule } from '@nestjs/platform-express';
import { ContractModule } from './models/contract/contract.module';
@Module({
  imports: [
    MulterModule.register({
      dest: './files/product',
    }),
    RoleModule,
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        STRIPE_SECRET_KEY: Joi.string(),
        STRIPE_CURRENCY: Joi.string(),
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        PORT: Joi.number(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION_TIME: Joi.string().required(),
      }),
    }),
    DatabaseModule,
    AuthModule,
    CategoryModule,
    SubCategoryModule,
    ProductModule,
    TagModule,
    CartModule,
    OrderModule,
    PaymentModule,
    InvoiceModule,
    ContractModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
