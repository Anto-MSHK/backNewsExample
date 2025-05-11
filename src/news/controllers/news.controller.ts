import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { NewsOwnerGuard } from '../guards/news-owner.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { NewsService } from '../services/news.service';
import { CreateNewsDto } from '../dto/create-news.dto';
import { UpdateNewsDto } from '../dto/update-news.dto';
import { NewsFilterDto } from '../dto/news-filter.dto';
import { News } from '../entities/news.entity';

/**
 * Контроллер для работы с новостями
 */
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  /**
   * Создание новой новости
   * @param createNewsDto DTO с данными для создания новости
   * @param req Объект запроса с данными пользователя
   * @returns Созданная новость
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.AUTHOR, UserRole.ADMIN)
  async create(
    @Body() createNewsDto: CreateNewsDto,
    @Request() req,
  ): Promise<News> {
    return this.newsService.create(createNewsDto, req.user);
  }

  /**
   * Получение списка новостей с возможностью фильтрации
   * @param filterDto DTO с параметрами фильтрации
   * @returns Массив новостей
   */
  @Get()
  async findAll(@Query() filterDto: NewsFilterDto): Promise<News[]> {
    return this.newsService.findAll(filterDto);
  }

  /**
   * Получение информации о новости по ID
   * @param id ID новости
   * @returns Новость
   */
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<News> {
    return this.newsService.findOne(+id);
  }

  /**
   * Обновление данных новости
   * @param id ID новости
   * @param updateNewsDto DTO с данными для обновления новости
   * @returns Обновленная новость
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard, NewsOwnerGuard)
  @Roles(UserRole.AUTHOR, UserRole.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateNewsDto: UpdateNewsDto,
  ): Promise<News> {
    return this.newsService.update(+id, updateNewsDto);
  }

  /**
   * Удаление новости
   * @param id ID новости
   * @returns Результат удаления
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard, NewsOwnerGuard)
  @Roles(UserRole.AUTHOR, UserRole.ADMIN)
  async remove(@Param('id') id: string): Promise<void> {
    return this.newsService.remove(+id);
  }
}
