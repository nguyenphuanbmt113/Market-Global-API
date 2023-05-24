import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/common/entities/category.entity';
import { SubCategory } from 'src/common/entities/sub-category.entity';
import { Repository } from 'typeorm';
import { CategoryCreateDTO } from './dto/create-category.dto';
import { CategoryUpdateDTO } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepo: Repository<Category>,
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
  async createCategory(
    categoryCreateDto: CategoryCreateDTO,
  ): Promise<Category> {
    const category = await this.categoryRepo.create({
      ...categoryCreateDto,
    });
    await this.categoryRepo.save(category);
    return category;
  }
  // add sub-category :id/new-sub-category(chỉ có admin mới chơi đc)
  async addSubCategory(
    categoryId: number,
    sub_categoryCreateDto: CategoryCreateDTO,
  ): Promise<SubCategory> {
    const category = await this.findOneByIdCategory(categoryId);
    const sub_category = new SubCategory();
    sub_category.category = category;
    sub_category.name = sub_categoryCreateDto.name;
    sub_category.description = sub_categoryCreateDto.description;
    sub_category.products = [];
    await sub_category.save();
    return sub_category;
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
