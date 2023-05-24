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
import { SubCategoryService } from './sub_category.service';
import { SubCategoryUpdateDTO } from './dto/update-subcategory.dto';

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
}
