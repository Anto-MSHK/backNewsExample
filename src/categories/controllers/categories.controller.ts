import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { CategoriesService } from '../services/categories.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { Category } from '../entities/category.entity';

/**
 * Контроллер для работы с категориями новостей
 */
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  /**
   * Создание новой категории
   * @param createCategoryDto DTO с данными для создания категории
   * @returns Созданная категория
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    return this.categoriesService.create(createCategoryDto);
  }

  /**
   * Получение списка всех категорий
   * @returns Массив категорий
   */
  @Get()
  async findAll(): Promise<Category[]> {
    return this.categoriesService.findAll();
  }

  /**
   * Получение информации о категории по ID
   * @param id ID категории
   * @returns Категория
   */
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Category> {
    return this.categoriesService.findOne(+id);
  }

  /**
   * Обновление данных категории
   * @param id ID категории
   * @param updateCategoryDto DTO с данными для обновления категории
   * @returns Обновленная категория
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  /**
   * Удаление категории
   * @param id ID категории
   * @returns Результат удаления
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async remove(@Param('id') id: string): Promise<void> {
    return this.categoriesService.remove(+id);
  }
}
