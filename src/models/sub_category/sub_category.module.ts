import { Module } from '@nestjs/common';
import { SubCategoryController } from './sub_category.controller';
import { SubCategoryService } from './sub_category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubCategory } from 'src/common/entities/sub-category.entity';
import { SubCategoryTag } from 'src/common/entities/sub-category-tab.entity';
import { TagModule } from '../tag/tag.module';
import { ProductService } from '../product/product.service';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SubCategory, SubCategoryTag]),
    TagModule,
    ProductModule,
  ],
  controllers: [SubCategoryController],
  providers: [SubCategoryService],
  exports: [SubCategoryService],
})
export class SubCategoryModule {}
