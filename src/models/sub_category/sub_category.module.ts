import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubCategoryTag } from 'src/common/entities/sub-category-tab.entity';
import { SubCategory } from 'src/common/entities/sub-category.entity';
import { ProductModule } from '../product/product.module';
import { TagModule } from '../tag/tag.module';
import { SubCategoryController } from './sub_category.controller';
import { SubCategoryService } from './sub_category.service';

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
