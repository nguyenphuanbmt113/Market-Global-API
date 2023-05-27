import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartProduct } from 'src/common/entities/cart_product.entity';
import { ProductTag } from 'src/common/entities/product-tab.entity';
import { Product } from 'src/common/entities/product.entity';
import { ProductsPagination } from 'src/common/interface/global.interface';
import { Repository } from 'typeorm';
import { CartService } from '../cart/cart.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepo: Repository<Product>,

    // @InjectRepository(Cart)
    @Inject(forwardRef(() => CartService))
    private cartService: CartService,

    @InjectRepository(ProductTag)
    public readonly productTagRepository: Repository<ProductTag>,

    @InjectRepository(CartProduct)
    public readonly cartProductRepository: Repository<CartProduct>,
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
        'product.image',
        'product.currentPrice',
        'product.previousPrice',
        'product.subCategoryId',
      ])
      .where('productTag.name LIKE :name', { name: name })
      .getMany();
    return searchResults;
  }

  async searchForProductsByTagName(tag: string) {
    const queryBuilder = this.productRepo.createQueryBuilder('product');
    const products = await queryBuilder
      .leftJoinAndSelect('product.productTags', 'productTag')
      .where(
        'productTag.productId IS NOT NULL AND productTag.name LIKE :name',
        { name: tag },
      )
      .getMany();
    return products;
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

  async deleteProduct(id: number) {
    const product = await this.getProductById(id);

    for (let i = 0; i < product.productTags.length; i++) {
      //xóa data trong tag product
      await this.productTagRepository.delete(product.productTags[i].id);
    }
    const result = await this.productRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('not found product');
    }
    return 'oke';
  }

  async getTotalSales(): Promise<number> {
    const { sum } = await this.productRepo
      .createQueryBuilder('product')
      .select('SUM(product.sales)', 'sum')
      .getRawOne();
    return sum ? sum : 0;
  }

  async getMixLatestProduct() {
    const queryBuilder = this.productRepo.createQueryBuilder();
    const products = await queryBuilder
      .leftJoinAndSelect('product.productTags', 'productTag')
      .take(16)
      .getMany();
    const filteredProducts = [].concat(
      products.sort((a, b) => {
        return <any>new Date(b.createdAt) - <any>new Date(a.createdAt);
      }),
    );
    return filteredProducts;
  }
  async getMixLatestProductV2() {
    const queryBuilder = this.productRepo.createQueryBuilder('product');
    const products = await queryBuilder
      .leftJoinAndSelect('product.productTags', 'productTag')
      .take(16)
      .orderBy('product.createdAt', 'DESC')
      .getMany();
    return products;
  }

  async getMostSalesProducts() {
    const queryBuilder = this.productRepo.createQueryBuilder('product');
    const products = await queryBuilder
      .orderBy({
        'product.sales': 'DESC',
      })
      .leftJoinAndSelect('product.productTags', 'productTag')
      .take(10)
      .getMany();
    return products;
  }

  async customFilter(
    productsCustomFilterDto: any,
  ): Promise<ProductsPagination> {
    const { range1, range2, limit, stock, subCategoryId, tag, page } =
      productsCustomFilterDto;
    const queryBuilder = this.productRepo.createQueryBuilder('product');
    const currentPage = page || 1;
    queryBuilder
      .leftJoinAndSelect('product.productTags', 'productTag')
      .where('product.id IS NOT NULL');
    if (range1) {
      queryBuilder.andWhere('product.currentPrice >= :range1', {
        range1: range1,
      });
    }
    if (range2) {
      queryBuilder.andWhere('product.currentPrice <= :range2', {
        range2: range2,
      });
    }
    if (stock) {
      const inStock = stock === 'In Stock';
      if (inStock) {
        queryBuilder.andWhere('product.inStock = :stock', { stock: true });
      } else {
        queryBuilder.andWhere('product.inStock = :stock', { stock: false });
      }
    }
    if (subCategoryId) {
      queryBuilder.andWhere('product.subCategoryId = :subCategoryId', {
        subCategoryId: subCategoryId,
      });
    }
    if (tag) {
      queryBuilder.andWhere(
        'productTag.productId IS NOT NULL AND productTag.name LIKE :name',
        { name: tag },
      );
    }
    const totalProducts = await queryBuilder.getCount();

    const products = await queryBuilder
      .skip((currentPage - 1) * limit)
      .take(limit)
      .orderBy({ 'product.createdAt': 'ASC' })
      .getMany();

    return {
      products: products,
      currentPage: currentPage,
      hasNextPage: limit * currentPage < totalProducts,
      hasPreviousPage: currentPage > 1,
      nextPage: currentPage + 1,
      previousPage: currentPage - 1,
      lastPage: Math.ceil(totalProducts / limit),
    };
  }

  async addProductToCart(
    productId: number,
    cartId: number,
    createCartProductDto: any,
  ) {
    const cart = await this.cartService.getUserCart(null, cartId);
    const product = await this.getProductById(productId);
    const { quantity } = createCartProductDto;
    //kiem tra trong cart co san pham do chua
    const cartProductIndex = cart.cartProducts.findIndex(
      (cp) => cp.productId === product.id,
    );
    //neu co rui
    if (cartProductIndex >= 0) {
      //lay product do ra
      const currentCartProduct = cart.cartProducts[cartProductIndex];
      //them quantity
      currentCartProduct.quantity = currentCartProduct.quantity + quantity;
      //total price
      currentCartProduct.totalPrice =
        product.currentPrice * currentCartProduct.quantity;
      const savedCartProduct = await currentCartProduct.save();
      cart.cartProducts[cartProductIndex] = savedCartProduct;
      await cart.save();
      return await cart.save();
    } else {
      //neu chua co
      const cartProduct = new CartProduct();
      cartProduct.productId = productId;
      cartProduct.image = product.image;
      cartProduct.quantity = quantity;
      cartProduct.totalPrice = product.currentPrice * quantity;
      cartProduct.maxPush = product.quantity;
      cartProduct.name = product.name;
      cart.totalItems += 1;
      cartProduct.cart = await cart.save();
      await cartProduct.save();
      return await this.cartService.getUserCart(null, cart.id);
    }
  }
}
