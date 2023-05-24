import { Column, Entity, ManyToOne } from 'typeorm';
import { ItemTag } from '../classes/abstract-item';
import { Product } from './product.entity';

@Entity('product-tag')
export class ProductTag extends ItemTag {
  @ManyToOne(() => Product, (product) => product.productTags, {
    eager: false,
  })
  product: Product;

  @Column()
  productId: number;
}
