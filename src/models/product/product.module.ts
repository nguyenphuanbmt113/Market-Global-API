import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartProduct } from 'src/common/entities/cart_product.entity';
import { ProductTag } from 'src/common/entities/product-tab.entity';
import { Product } from 'src/common/entities/product.entity';
import { SubCategoryTag } from 'src/common/entities/sub-category-tab.entity';
import { Tag } from 'src/common/entities/tag.entity';
import { CartModule } from '../cart/cart.module';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      ProductTag,
      SubCategoryTag,
      CartProduct,
      Tag,
    ]),
    forwardRef(() => CartModule),
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
