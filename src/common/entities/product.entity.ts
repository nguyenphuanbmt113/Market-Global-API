import { Column, Entity, ManyToOne, OneToMany, Unique } from 'typeorm';
import { ProductTag } from './product-tab.entity';
import { SubCategory } from './sub-category.entity';
import { AbstractProduct } from '../classes/abstract-product';

@Entity('products')
@Unique(['name'])
export class Product extends AbstractProduct {
  @Column('text', {
    default: '',
  })
  image: string;

  @Column()
  description: string;

  @Column({
    default: true,
  })
  inStock: boolean;

  @Column('float', {
    default: 0.0,
  })
  currentPrice: number;

  @Column('float', {
    nullable: true,
  })
  previousPrice: number;

  @Column({
    default: 0,
  })
  sales: number;

  @OneToMany(() => ProductTag, (productTag) => productTag.product, {
    eager: true,
    nullable: true,
  })
  productTags: ProductTag[];

  @ManyToOne(() => SubCategory, (subCategory) => subCategory.products, {
    eager: false,
  })
  subCategory: SubCategory;

  @Column({
    default: new Date(Date.now()),
  })
  createdAt: Date;

  @Column({
    nullable: true,
  })
  updatedAt: Date;

  @Column()
  subCategoryId: number;
}
