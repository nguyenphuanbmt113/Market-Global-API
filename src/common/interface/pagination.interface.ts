import { Product } from '../entities/product.entity';

export interface ProductsPagination {
  products: Product[];
  currentPage: number;
  nextPage: number;
  previousPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  lastPage: number;
}
export interface ProductsCustomFilterDto {
  range1?: number;
  range2?: number;
  page?: number;
  subCategoryId?: number;
  tag?: string;
  limit?: number;
  stock?: string;
}
