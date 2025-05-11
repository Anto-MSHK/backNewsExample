import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';

/**
 * Сервис для работы с категориями новостей
 */
@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  /**
   * Создание новой категории
   * @param createCategoryDto DTO с данными для создания категории
   * @returns Созданная категория
   */
  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    // Проверяем, существует ли категория с таким названием
    const existingCategory = await this.categoriesRepository.findOne({
      where: { name: createCategoryDto.name },
    });

    if (existingCategory) {
      throw new ConflictException('Категория с таким названием уже существует');
    }

    const newCategory = this.categoriesRepository.create(createCategoryDto);
    return this.categoriesRepository.save(newCategory);
  }

  /**
   * Получение всех категорий
   * @returns Массив категорий
   */
  async findAll(): Promise<Category[]> {
    return this.categoriesRepository.find();
  }

  /**
   * Поиск категории по ID
   * @param id ID категории
   * @returns Найденная категория
   */
  async findOne(id: number): Promise<Category> {
    const category = await this.categoriesRepository.findOne({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(`Категория с ID ${id} не найдена`);
    }

    return category;
  }

  /**
   * Обновление данных категории
   * @param id ID категории
   * @param updateCategoryDto DTO с данными для обновления категории
   * @returns Обновленная категория
   */
  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.findOne(id);

    // Проверяем уникальность названия категории
    if (updateCategoryDto.name !== category.name) {
      const existingCategory = await this.categoriesRepository.findOne({
        where: { name: updateCategoryDto.name },
      });

      if (existingCategory) {
        throw new ConflictException(
          'Категория с таким названием уже существует',
        );
      }
    }

    // Обновляем данные
    this.categoriesRepository.merge(category, updateCategoryDto);
    return this.categoriesRepository.save(category);
  }

  /**
   * Удаление категории
   * @param id ID категории
   * @returns Результат удаления
   */
  async remove(id: number): Promise<void> {
    const category = await this.findOne(id);
    await this.categoriesRepository.remove(category);
  }
}
