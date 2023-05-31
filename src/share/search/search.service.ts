import { Injectable } from '@nestjs/common';
import { CategoryService } from 'src/models/category/category.service';
import { ProductService } from 'src/models/product/product.service';
import { SubCategoryService } from 'src/models/sub_category/sub_category.service';

@Injectable()
export class SearchService {
  constructor(
    private productService: ProductService,
    private subCategoryService: SubCategoryService,
    private categoryService: CategoryService,
  ) {}

  async search(
    name: string,
    type: string,
    take: number,
    page?: number,
    limit?: number,
  ) {
    let arr = [];
    let productsPagination;
    switch (type) {
      case 'Categories': {
        arr = await this.categoryService.searchByName(name, take);
        return arr;
      }
      case 'Sub Categories': {
        arr = await this.subCategoryService.searchByName(name, take);
        return arr;
      }
      case 'Products': {
        productsPagination = await this.productService.searchByName(
          name,
          page,
          limit,
        );
        return productsPagination;
      }
    }
  }

  async getNames(name: string, type: string) {
    let arr = [];
    switch (type) {
      case 'Categories': {
        arr = await this.categoryService.findByName(name);
        return arr;
      }
      case 'Sub Categories': {
        arr = await this.subCategoryService.getSubCategoriesNames(name);
        return arr;
      }
      case 'Products': {
        arr = await this.productService.getProductsNames(name);
        return arr;
      }
    }
  }
}
