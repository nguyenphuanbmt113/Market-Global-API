import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { ProductModule } from 'src/models/product/product.module';
import { CategoryModule } from 'src/models/category/category.module';

@Module({
  imports: [ProductModule, CategoryModule],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
