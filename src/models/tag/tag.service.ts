import {
  Injectable,
  NotFoundException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from 'src/common/entities/tag.entity';
import { Repository } from 'typeorm';
import { SubCategoryService } from '../sub_category/sub_category.service';
import { SubCategory } from 'src/common/entities/sub-category.entity';
import { ProductService } from '../product/product.service';
import { ProductTag } from 'src/common/entities/product-tab.entity';
import { SubCategoryTag } from 'src/common/entities/sub-category-tab.entity';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag) private readonly tagRepo: Repository<Tag>,

    @InjectRepository(ProductTag)
    private readonly tagProductRepo: Repository<ProductTag>,

    @InjectRepository(SubCategoryTag)
    private readonly subCategoryTag: Repository<SubCategoryTag>,

    @InjectRepository(SubCategory)
    private readonly subCateRepo: Repository<SubCategory>,

    @Inject(forwardRef(() => SubCategoryService))
    private subCateservice: SubCategoryService,

    @Inject(forwardRef(() => ProductService))
    private productService: ProductService,
  ) {}

  async getAllTags(): Promise<Tag[]> {
    return await this.tagRepo.find();
  }

  async getTotalTags() {
    return await this.tagRepo.createQueryBuilder().getCount();
  }

  async createNewTag(createTagDto: any): Promise<Tag> {
    const { name } = createTagDto;
    const tag = new Tag();
    tag.name = name;
    const newTag = await tag.save();
    return newTag;
  }

  async getTagById(id: number): Promise<Tag> {
    const tag = await this.tagRepo.findOne({
      where: {
        id,
      },
    });
    if (!tag) {
      throw new NotFoundException(`Tag with id ${id} does not found`);
    }
    return tag;
  }

  async updateTag(id: number, updateTagDto: any): Promise<Tag> {
    const tag = await this.getTagById(id);
    const { name } = updateTagDto;
    tag.name = name;
    tag.updatedAt = new Date(Date.now());
    return await tag.save();
  }

  async deleteTag(id: number) {
    const tag = await this.getTagById(id);

    const subcategorys = await this.subCateservice.getSubCategoriesByTagName(
      tag.name,
    );
    const products = await this.productService.searchForProductsByTagName(
      tag.name,
    );

    for (let i = 0; i < subcategorys.length; i++) {
      for (let j = 0; j < subcategorys[i].subCategoryTags.length; j++) {
        if (tag.id === subcategorys[i].subCategoryTags[j].id) {
          //xóa ở trong sub_category
          await this.subCategoryTag.delete(
            subcategorys[i].subCategoryTags[j].id,
          );
        }
      }
    }

    for (let i = 0; i < products.length; i++) {
      for (let j = 0; j < products[i].productTags.length; j++) {
        if (tag.id === products[i].productTags[j].id) {
          //xóa ở trong product_tag
          await this.tagProductRepo.delete(products[i].productTags[j].id);
        }
      }
    }
    const result = await this.tagRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Tag with id ${id} does not found!`);
    }
  }
}
