import { Column, Entity, ManyToOne } from 'typeorm';
import { SubCategory } from './sub-category.entity';
import { ItemTag } from '../classes/abstract-item';

@Entity('sub-category-tag')
export class SubCategoryTag extends ItemTag {
  @ManyToOne(() => SubCategory, (subCategory) => subCategory.subCategoryTags, {
    eager: false,
  })
  subCategory: SubCategory;

  @Column()
  subCategoryId: number;
}
