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
export interface RemoveCartItem {
  cartProductId: number;
  productId: number;
}
export class BillingAddress {
  fullName: string;
  country: string;
  city: string;
  address1: string;
  address2?: string;
  postalCode: number;
  phone: string;
  email: string;
  comments: string;
}
