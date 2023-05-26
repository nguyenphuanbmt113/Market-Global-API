import { Module, forwardRef } from '@nestjs/common';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from 'src/common/entities/tag.entity';
import { SubCategoryModule } from '../sub_category/sub_category.module';
import { SubCategory } from 'src/common/entities/sub-category.entity';
import { ProductModule } from '../product/product.module';
import { ProductTag } from 'src/common/entities/product-tab.entity';
import { SubCategoryTag } from 'src/common/entities/sub-category-tab.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tag, SubCategoryTag, ProductTag, SubCategory]),
    forwardRef(() => SubCategoryModule),
    ProductModule,
  ],
  controllers: [TagController],
  providers: [TagService],
  exports: [TagService],
})
export class TagModule {}
