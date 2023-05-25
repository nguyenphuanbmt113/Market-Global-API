import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserRole } from 'src/common/entities/role.entity';
import { Roles } from '../auth/decorator/role.decorator';
import { AuthenticationGuard } from '../auth/guards/jwt-guards.guard';
import { RolesGuard } from '../auth/guards/role.guard';
import { SubCategoryService } from './sub_category.service';
import { SubCategoryUpdateDTO } from './dto/update-subcategory.dto';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('sub-category')
export class SubCategoryController {
  constructor(private readonly subCategoryService: SubCategoryService) {}
  @Get()
  getAllSubCategories() {
    return this.subCategoryService.getAllSubCategories();
  }

  @Get('match-by-name/:name')
  searchMatchByName(@Param('name') name: string) {
    return this.subCategoryService.getMatchingByNames(name);
  }

  @Get(':id')
  getSubCategory(@Param('id') id: number) {
    return this.subCategoryService.getSubCategory(id);
  }

  @Put(':id/update')
  @UseGuards(AuthenticationGuard, RolesGuard)
  @Roles(UserRole.Admin)
  updateSubCategory(
    @Param('id') id: number,
    @Body() updateSubCategoryDto: SubCategoryUpdateDTO,
  ) {
    return this.subCategoryService.updateSubCategory(id, updateSubCategoryDto);
  }

  @Post(':id/add-tags')
  @UseGuards(AuthenticationGuard, RolesGuard)
  @Roles(UserRole.Admin)
  addTagsToCategory(@Param('id') id: number, @Body() payload: any) {
    return this.subCategoryService.addTagsToCategory(id, payload);
  }

  @Delete(':id/remove-tags')
  @UseGuards(AuthenticationGuard, RolesGuard)
  @Roles(UserRole.Admin)
  removeTagsFromCategory(@Param('id') id: number, @Body() data: any) {
    const { payload } = data;
    return this.subCategoryService.removeTagsFromCategory(id, payload);
  }

  @Post(':id/new-product/:folderName/:subFolder/:type')
  @UseGuards(AuthenticationGuard, RolesGuard)
  @Roles(UserRole.Admin)
  @UseInterceptors(FilesInterceptor('images'))
  newProduct(
    @Param('id') id: number,
    @Param('type') type: string,
    @Param('folderName') folderName: string,
    @Param('subFolder') subFolder: string,
    @Body('name') name: string,
    @Body('description') description: string,
    @Body('references') refArr: any,
    @Body('currentPrice') currentPrice: number,
    @Body('quantity') quantity: number,
    @UploadedFiles() images: any,
  ) {
    return this.subCategoryService.newProduct(id, images, {
      name,
      description,
      quantity,
      currentPrice,
    });
  }

  @Get('mix-latest-products')
  getMixedLatestProducts() {
    return this.subCategoryService.fetchMixLatestProducts();
  }
}
