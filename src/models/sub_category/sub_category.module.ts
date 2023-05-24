import { Module } from '@nestjs/common';
import { SubCategoryController } from './sub_category.controller';
import { SubCategoryService } from './sub_category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubCategory } from 'src/common/entities/sub-category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SubCategory])],
  controllers: [SubCategoryController],
  providers: [SubCategoryService],
})
export class SubCategoryModule {}
