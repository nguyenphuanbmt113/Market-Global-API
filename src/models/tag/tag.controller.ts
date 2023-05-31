import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserRole } from 'src/common/entities/role.entity';
import { Roles } from '../auth/decorator/role.decorator';
import { AuthenticationGuard } from '../auth/guards/jwt-guards.guard';
import { RolesGuard } from '../auth/guards/role.guard';
import { ProductService } from '../product/product.service';
import { SubCategoryService } from '../sub_category/sub_category.service';
import { TagService } from './tag.service';

@Controller('tag')
export class TagController {
  constructor(
    private tagService: TagService,
    private subCategoryService: SubCategoryService,
    private productService: ProductService,
  ) {}

  @Get()
  getAllTags() {
    return this.tagService.getAllTags();
  }

  @Get('sub-categories')
  getSubCategoriesTags() {
    return this.subCategoryService.getSubCategoryTags();
  }

  @Get('products')
  getProductsTags() {
    return this.productService.getProductsTags();
  }

  @Post('new')
  @UseGuards(AuthenticationGuard, RolesGuard)
  @Roles(UserRole.Admin)
  newTag(@Body() createTagDto: any) {
    return this.tagService.createNewTag(createTagDto);
  }

  @Delete(':id/delete')
  @UseGuards(AuthenticationGuard, RolesGuard)
  @Roles(UserRole.Admin)
  @UseGuards(AuthenticationGuard, RolesGuard)
  @Roles(UserRole.Admin)
  deleteTag(@Param('id') id: number) {
    return this.tagService.deleteTag(id);
  }

  @Get(':id')
  getTagById(@Param('id') id: number) {
    return this.tagService.getTagById(id);
  }

  @Put(':id/update')
  @UseGuards(AuthenticationGuard, RolesGuard)
  @Roles(UserRole.Admin)
  @UseGuards(AuthenticationGuard, RolesGuard)
  @Roles(UserRole.Admin)
  updateTag(@Param('id') id: number, @Body() updateTagDto: any) {
    return this.tagService.updateTag(id, updateTagDto);
  }
}
