import { Column, Entity, ManyToOne, OneToMany, Unique } from 'typeorm';
import { Category } from './category.entity';
import { SubCategoryTag } from './sub-category-tab.entity';
import { Product } from './product.entity';
import { AbstractCategory } from '../classes/abstract-category';

@Entity('sub-categories')
@Unique(['name'])
export class SubCategory extends AbstractCategory {
  @OneToMany(() => Product, (product) => product.subCategory, {
    eager: true,
  })
  products: Product[];

  @OneToMany(
    () => SubCategoryTag,
    (subCategoryTag) => subCategoryTag.subCategory,
    {
      eager: true,
    },
  )
  subCategoryTags: SubCategoryTag[];

  @ManyToOne(() => Category, (category) => category.subCategories, {
    eager: false,
  })
  category: Category;

  @Column()
  categoryId: number;
}
