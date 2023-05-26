import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductTag } from 'src/common/entities/product-tab.entity';
import { Product } from 'src/common/entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepo: Repository<Product>,

    @InjectRepository(ProductTag)
    public readonly productTagRepository: Repository<ProductTag>,
  ) {}

  async getAllProducts() {
    const products = await this.productRepo.find();
    return products;
  }

  async getShopProducts(pageNumber: number, limit: number) {
    const page = pageNumber || 1;
    const queryBuilder = this.productRepo.createQueryBuilder('product');
    const totalProducts = await queryBuilder.getCount();
    const products = await queryBuilder
      .leftJoinAndSelect('product.productTags', 'productTag')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return {
      products: products,
      currentPage: page,
      hasNextPage: limit * page < totalProducts,
      hasPreviousPage: page > 1,
      nextPage: page + 1,
      previousPage: page - 1,
      lastPage: Math.ceil(totalProducts / limit),
    };
  }

  async getProductsNames(name: string) {
    const queryBuilder = this.productRepo.createQueryBuilder('product');
    const products = await queryBuilder
      .select(['product.name'])
      .where('product.name ILIKE :name', { name: `%${name}%` })
      .getMany();
    return products;
  }

  async getTotalProducts() {
    const totalProducts = await this.productRepo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.productTags', 'productTags')
      .getCount();

    return totalProducts;
  }

  async fetchProductsTagsNames() {
    const query = this.productTagRepository.createQueryBuilder('productTag');
    const productTags = await query
      .select('productTag.name')
      .distinct(true)
      .getMany();
    return productTags;
  }

  async getProductById(id: number): Promise<Product> {
    const product = await this.productRepo.findOne({
      where: {
        id,
      },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async getMatchingByNames(name: string) {
    const queryBuilder = this.productRepo.createQueryBuilder('product');
    const searchResults = await queryBuilder
      .leftJoinAndSelect('product.productTags', 'productTag')
      .select([
        'product.id',
        'product.name',
        'product.images',
        'product.currentPrice',
        'product.previousPrice',
        'product.subCategoryId',
      ])
      .where('productTag.name LIKE :name', { name: name })
      .getMany();
    return searchResults;
  }

  async getProductsTags() {
    const productTags = await this.productTagRepository.find();
    const uniqueArray = [];
    for (let i = 0; i < productTags.length; i++) {
      if (!uniqueArray.includes(productTags[i].name)) {
        uniqueArray.push(productTags[i]);
      }
      // const item = uniqueArray.find(
      //   (item) => item.name === productTags[i].name,
      // );
      // if (!item) {
      //   uniqueArray = [...uniqueArray, productTags[i]];
      // }
    }
    return uniqueArray;
  }

  async updateProduct(id: number, updateProductDto: any): Promise<Product> {
    const product = await this.getProductById(id);
    const { name, currentPrice, quantity, description } = updateProductDto;
    product.name = name;
    product.description = description;
    product.quantity = quantity;
    if (product.quantity === 0) {
      product.inStock = false;
    }
    if (currentPrice) {
      product.previousPrice = product.currentPrice;
      product.currentPrice = currentPrice;
    }

    product.updatedAt = new Date(Date.now());
    const updatedProduct = await product.save();
    return updatedProduct;
  }

  async addTagsToProduct(id: number, payload: any) {
    const product = await this.getProductById(id);
    //tags: [1,2,3,4]
    let arrayTags = [];
    for (let i = 0; i < payload.tags.length; i++) {
      const tag = await this.productTagRepository.findOneByOrFail({
        id: payload.tags[i].id,
      });
      arrayTags = [...arrayTags, tag];
    }
    product.productTags = [...arrayTags];
    await product.save();
    return arrayTags;
  }

  async removeTagsFromProduct(id: number, payload: any) {
    const product = await this.getProductById(id);
    //xóa mot thui nhoe
    for (let i = 0; i < product.productTags.length; i++) {
      if (product.productTags[i].name === payload.name) {
        //xóa nó ra khỏi database
        await this.productTagRepository.delete(product.productTags[i].id);
        //xoas khoi product
        product.productTags = product.productTags.filter(
          (ptag) => ptag.id !== product.productTags[i].id,
        );
      }
    }
  }

  deleteProduct(id: number) {
    return 'oke';
  }
}
