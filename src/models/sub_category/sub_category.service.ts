import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubCategory } from 'src/common/entities/sub-category.entity';
import { Repository } from 'typeorm';
import { SubCategoryUpdateDTO } from './dto/update-subcategory.dto';
import { SubCategoryTag } from 'src/common/entities/sub-category-tab.entity';
import { Product } from 'src/common/entities/product.entity';
import { TagService } from '../tag/tag.service';
import { ProductService } from '../product/product.service';
import { InsertTagDto } from './dto/insert-tags.dto';

@Injectable()
export class SubCategoryService {
  constructor(
    @InjectRepository(SubCategory)
    private subCategoryRepository: Repository<SubCategory>,

    @InjectRepository(SubCategoryTag)
    public readonly subCategoryTagRepository: Repository<SubCategoryTag>,
    private readonly tagService: TagService,
    private readonly productService: ProductService,
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

  async addTagsToCategory(id: number, dataCreateTagDto: InsertTagDto) {
    let addedTags = [];
    for (let i = 0; i < dataCreateTagDto.tags.length; i++) {
      const sub_category = await this.getSubCategory(id);
      const tag = await this.tagService.getTagById(dataCreateTagDto.tags[i]);
      console.log('tag:', tag);
      const sub_category_tag = new SubCategoryTag();
      sub_category_tag.name = tag.name;
      sub_category_tag.tagId = tag.id;
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

  async newProduct(
    subCategoryId: number,
    image: any,
    productPayload: {
      name: string;
      description: string;
      quantity: number;
      currentPrice: number;
    },
  ) {
    const subCategory = await this.getSubCategory(subCategoryId);
    const { name, description, currentPrice, quantity } = productPayload;
    const product = new Product();
    product.name = name;
    product.description = description;
    product.currentPrice = currentPrice;
    product.image = image.path;
    product.quantity = quantity;
    product.productTags = [];
    product.subCategory = subCategory;
    const newProduct = await product.save();
    return newProduct;
  }

  async fetchMixLatestProducts() {
    const subCategories = await this.getAllSubCategories();
    const date = new Date(Date.now());
    const currentMonth = date.getMonth();
    let mixFilteredProducts = [];
    for (const subCategory of subCategories) {
      const products: Product[] = subCategory.products.filter(
        (p) =>
          p.createdAt.getMonth() + 1 === currentMonth + 1 && p.inStock === true,
      );
      mixFilteredProducts = mixFilteredProducts.concat(products.slice(0, 1));
    }
    return mixFilteredProducts;
  }

  async deleteSubCategory(id: number) {
    const subCategory = await this.getSubCategory(id);
    for (let i = 0; i < subCategory.products.length; i++) {
      await this.productService.deleteProduct(subCategory.products[i].id);
    }
    for (let i = 0; i < subCategory.subCategoryTags.length; i++) {
      await this.subCategoryTagRepository.delete(
        subCategory.subCategoryTags[i].id,
      );
    }
    const result = await this.subCategoryRepository.delete(id);
    if (result.affected === 0) {
      throw new NotAcceptableException('Not Found Sub Category');
    }
  }
}
