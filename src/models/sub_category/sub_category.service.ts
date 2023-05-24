import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubCategory } from 'src/common/entities/sub-category.entity';
import { Repository } from 'typeorm';
import { SubCategoryUpdateDTO } from './dto/update-subcategory.dto';
import { SubCategoryTag } from 'src/common/entities/sub-category-tab.entity';

@Injectable()
export class SubCategoryService {
  constructor(
    @InjectRepository(SubCategory)
    private subCategoryRepository: Repository<SubCategory>,

    @InjectRepository(SubCategoryTag)
    public readonly subCategoryTagRepository: Repository<SubCategoryTag>,
  ) {}
  async getAllSubCategories() {
    return await this.subCategoryRepository.find();
  }

  async searchByName(name: string, take: number) {
    const queryBuilder =
      this.subCategoryRepository.createQueryBuilder('subCategory');
    const subCategories = await queryBuilder
      .leftJoinAndSelect('subCategory.products', 'product')
      .where('subCategory.name ILIKE :name', { name: `%${name}%` })
      .take(take)
      .getMany();
    return subCategories;
  }

  async getSubCategoriesNames(name) {
    const queryBuilder =
      this.subCategoryRepository.createQueryBuilder('subCategory');
    const subCategories = await queryBuilder
      .select(['subCategory.name'])
      .where('subCategory.name ILIKE :name', { name: `%${name}%` })
      .getMany();
    return subCategories;
  }

  async getMatchingByNames(name: string) {
    const queryBuilder =
      this.subCategoryRepository.createQueryBuilder('subCategory');
    const searchResults = await queryBuilder
      .select('subCategory.name')
      .where('subCategory.name ILIKE :name', { name: `%${name}%` })
      .getMany();
    return searchResults;
  }

  async getTotalSubCategories() {
    return await this.subCategoryRepository.createQueryBuilder().getCount();
  }

  async getSubCategory(id: number) {
    const subCategory = await this.subCategoryRepository.findOneByOrFail({
      id,
    });
    return subCategory;
  }

  async updateSubCategory(
    id: number,
    updateSubCategoryDto: SubCategoryUpdateDTO,
  ): Promise<SubCategory> {
    const subCategory = await this.getSubCategory(id);
    const { name, description } = updateSubCategoryDto;
    if (name) {
      subCategory.name = name;
    }
    if (description) {
      subCategory.description = description;
    }
    subCategory.updatedAt = new Date();
    const updatedSubCategory = await subCategory.save();
    return updatedSubCategory;
  }

  async addTagsToCategory(id: number, dataCreateTagDto: any) {
    let addedTags = [];
    for (let i = 0; i < dataCreateTagDto.length; i++) {
      const sub_category = await this.getSubCategory(id);
      const sub_category_tag = new SubCategoryTag();
      sub_category_tag.name = dataCreateTagDto.name;
      sub_category_tag.subCategory = sub_category;
      await sub_category_tag.save();
      addedTags = [...addedTags, sub_category_tag];
    }
    return addedTags;
  }

  async removeTagsFromCategory(id: number, payload: any) {
    const subcategory = await this.getSubCategory(id);

    for (let i = 0; i < payload.tags.length; i++) {
      const subCategoryTag = subcategory.subCategoryTags.find(
        (ct) => ct.id === payload.tags[i],
      );
      if (subCategoryTag) {
        await this.subCategoryTagRepository.delete(subCategoryTag.id);
        subcategory.subCategoryTags = subcategory.subCategoryTags.filter(
          (ct) => ct.id !== subCategoryTag.id,
        );
      }
    }
    return await subcategory.save();
  }

  async getSubCategoriesByTagName(tagName: string) {
    const queryBuider = await this.subCategoryRepository
      .createQueryBuilder('subcategory')
      .leftJoinAndSelect('subcategory.subCategoryTags', 'subCategoryTags')
      .leftJoinAndSelect('subcategory.products', 'products')
      .where('subCategoryTags.name ILIKE :name', { name: `%${tagName}%` })
      .getMany();

    return queryBuider;
  }

  async getSubCategoryTags() {
    const subCategoriesTags = await this.subCategoryTagRepository.find();
    let uniqueArray: SubCategoryTag[] = [];
    for (let i = 0; i < subCategoriesTags.length; i++) {
      const item = uniqueArray.find(
        (item) => item.name === subCategoriesTags[i].name,
      );
      if (!item) {
        uniqueArray = [...uniqueArray, subCategoriesTags[i]];
      }
    }
    return uniqueArray;
  }
  //deleteSubCategory
  //newProduct
}
