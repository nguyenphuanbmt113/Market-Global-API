import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/common/entities/category.entity';
import { SubCategory } from 'src/common/entities/sub-category.entity';
import { Repository } from 'typeorm';
import { CategoryCreateDTO } from './dto/create-category.dto';
import { CategoryUpdateDTO } from './dto/update-category.dto';
import { SubCategoryService } from '../sub_category/sub_category.service';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepo: Repository<Category>,

    private readonly subCategoryService: SubCategoryService,
  ) {}

  async findAll() {
    const categories = await this.categoryRepo.find();
    return categories;
  }

  async findOneByIdCategory(id: number) {
    const category = await this.categoryRepo.findOneByOrFail({
      id,
    });
    return category;
  }

  async findByName(name: string): Promise<Category[]> {
    const query = await this.categoryRepo.createQueryBuilder('category');
    const categories = await query
      .where('category.name ILIKE :name', { name: `%${name}%` })
      .select(['category.name'])
      .getMany();
    return categories;
  }
  //delete (chỉ có admin mới chơi đc)
  async delete(id: number) {
    const category = await this.categoryRepo.findOneByOrFail({
      id,
    });
    for (const subCategorie of category.subCategories) {
      await this.subCategoryService.deleteSubCategory(subCategorie.id);
    }
    await category.remove();
    return 'delete success';
  }
  //update (chỉ có admin mới chơi đc)
  async update(
    id: number,
    categoryUpdateDTO: CategoryUpdateDTO,
  ): Promise<Category> {
    const category = await this.categoryRepo.findOneByOrFail({
      id,
    });
    category.updatedAt = new Date();
    Object.assign(category, categoryUpdateDTO);
    await category.save();
    return category;
  }
  //create(chỉ có admin mới chơi đc)
  async createCategory(categoryCreateDto: CategoryCreateDTO) {
    const { name, description } = categoryCreateDto;
    const category = new Category();
    category.name = name;
    category.description = description;
    category.subCategories = [];
    const newCategory = await category.save();
    return newCategory;
  }
  // add sub-category :id/new-sub-category(chỉ có admin mới chơi đc)
  async addSubCategory(
    categoryId: number,
    sub_categoryCreateDto: CategoryCreateDTO,
  ) {
    const category = await this.categoryRepo.findOne({
      where: { id: categoryId },
    });
    console.log('category:', category);
    const { name, description } = sub_categoryCreateDto;
    const subCategory = new SubCategory();
    subCategory.category = category;
    subCategory.subCategoryTags = [];
    subCategory.name = name;
    subCategory.description = description;
    subCategory.products = [];
    const newSubCategory = await subCategory.save();
    return newSubCategory;
  }

  async getTotalCategories() {
    return await this.categoryRepo.createQueryBuilder().getCount();
  }

  async searchByName(name: string, take: number) {
    const queryBuilder = this.categoryRepo.createQueryBuilder('category');
    const categories = await queryBuilder
      .leftJoinAndSelect('category.subCategories', 'subCategory')
      .leftJoinAndSelect('subCategory.products', 'product')
      .where('category.name ILIKE :name', { name: `%${name}%` })
      .take(take)
      .getMany();
    return categories;
  }
}
/*
- làm lại phần delete
- match name
*/
