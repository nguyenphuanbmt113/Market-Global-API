import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { AuthenticationGuard } from '../auth/guards/jwt-guards.guard';
import { RolesGuard } from '../auth/guards/role.guard';
import { UserRole } from 'src/common/entities/role.entity';
import { Roles } from '../auth/decorator/role.decorator';
import { CategoryCreateDTO } from './dto/create-category.dto';
import { CategoryUpdateDTO } from './dto/update-category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  getAllCategories() {
    return this.categoryService.findAll();
  }

  @Post()
  @UseGuards(AuthenticationGuard, RolesGuard)
  @Roles(UserRole.Admin)
  newCategory(@Body() createCategoryDto: CategoryCreateDTO) {
    return this.categoryService.createCategory(createCategoryDto);
  }

  @Get(':id')
  getCategoryById(@Param('id') id: number) {
    return this.categoryService.findOneByIdCategory(id);
  }

  @Get('match-by-name/:name')
  searchMatchByName(@Param('name') name: string) {
    return this.categoryService.findByName(name);
  }

  @Post(':id/new-sub-category')
  @UseGuards(AuthenticationGuard, RolesGuard)
  @Roles(UserRole.Admin)
  newSubCategory(
    @Param('id') id: number,
    @Body() subCategoryDto: CategoryCreateDTO,
  ) {
    return this.categoryService.addSubCategory(id, subCategoryDto);
  }

  @Put(':id/update')
  @UseGuards(AuthenticationGuard, RolesGuard)
  @Roles(UserRole.Admin)
  updateCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: CategoryUpdateDTO,
  ) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id/delete')
  @UseGuards(AuthenticationGuard, RolesGuard)
  @Roles(UserRole.Admin)
  deleteCategory(@Param('id') id: number) {
    return this.categoryService.delete(id);
  }
}
