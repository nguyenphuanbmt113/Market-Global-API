import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { AuthenticationGuard } from '../auth/guards/jwt-guards.guard';
import { RolesGuard } from '../auth/guards/role.guard';
import { UserRole } from 'src/common/entities/role.entity';
import { Roles } from '../auth/decorator/role.decorator';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  getAllProducts() {
    return this.productService.getAllProducts();
  }

  @Get('shop')
  getShopProducts(@Query('limit') limit: number, @Query('page') page: number) {
    return this.productService.getShopProducts(page, limit);
  }

  @Get('tags-names')
  getProductsTagsName() {
    return this.productService.fetchProductsTagsNames();
  }

  @Get('count')
  getTotalProducts() {
    return this.productService.getTotalProducts();
  }

  @Get('match-by-name/:name')
  searchMatchByName(@Param('name') name: string) {
    return this.productService.getMatchingByNames(name);
  }

  @Post('custom-filter')
  getFilteredBetweenRange(@Body() productsCustomFilterDto: any) {
    return this.productService.customFilter(productsCustomFilterDto);
  }

  @Get('search-by-tag-name/:tagName')
  getProductsByTagName(@Param('tagName') tagName: string) {
    return this.productService.searchForProductsByTagName(tagName);
  }

  @Get(':id')
  getProductById(@Param('id') id: number) {
    return this.productService.getProductById(id);
  }

  @Put(':id/update')
  @UseGuards(AuthenticationGuard, RolesGuard)
  @Roles(UserRole.Admin)
  updateProduct(@Param('id') id: number, @Body() updateProductDto: any) {
    return this.productService.updateProduct(id, updateProductDto);
  }

  @Delete(':id/remove-tags')
  @UseGuards(AuthenticationGuard, RolesGuard)
  @Roles(UserRole.Admin)
  removeTagsFromProduct(@Param('id') id: number, @Body() data: any) {
    const { payload } = data;
    return this.productService.removeTagsFromProduct(id, payload);
  }

  @Post(':id/add-tags')
  @UseGuards(AuthenticationGuard, RolesGuard)
  @Roles(UserRole.Admin)
  addTagsToProduct(@Param('id') id: number, @Body() payload: any) {
    return this.productService.addTagsToProduct(id, payload);
  }

  @Delete(':id/delete')
  @UseGuards(AuthenticationGuard, RolesGuard)
  @Roles(UserRole.Admin)
  deleteProduct(@Param('id') id: number) {
    return this.productService.deleteProduct(id);
  }

  @Get('sales')
  getTotalSales() {
    return this.productService.getTotalSales();
  }

  @Get('mix-latest-products')
  async getMixLatestProduct() {
    return await this.productService.getMixLatestProduct();
  }

  @Post(':productId/add-to-cart/:cartId')
  @UseGuards(AuthenticationGuard, RolesGuard)
  @Roles(UserRole.User)
  addToCart(
    @Param('productId') productId: number,
    @Param('cartId') cartId: number,
    @Body() createCartProductDto: any,
  ) {
    return this.productService.addProductToCart(
      productId,
      cartId,
      createCartProductDto,
    );
  }
}
