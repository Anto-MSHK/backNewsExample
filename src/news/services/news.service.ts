import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  FindOptionsWhere,
  MoreThanOrEqual,
  LessThanOrEqual,
  Between,
} from 'typeorm';
import { News } from '../entities/news.entity';
import { CreateNewsDto } from '../dto/create-news.dto';
import { UpdateNewsDto } from '../dto/update-news.dto';
import { NewsFilterDto } from '../dto/news-filter.dto';
import { UsersService } from '../../users/services/users.service';
import { CategoriesService } from '../../categories/services/categories.service';
import { AgenciesService } from '../../agencies/services/agencies.service';
import { UserRole } from '../../common/enums/user-role.enum';
import { ExternalNewsService } from './external-news.service';
import { UnifiedNews } from '../interfaces/unified-news.interface';

/**
 * Сервис для работы с новостями
 */
@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News)
    private newsRepository: Repository<News>,
    private usersService: UsersService,
    private categoriesService: CategoriesService,
    private agenciesService: AgenciesService,
    private externalNewsService: ExternalNewsService,
  ) {}

  /**
   * Создание новой новости
   * @param createNewsDto DTO с данными для создания новости
   * @param currentUser Текущий пользователь
   * @returns Созданная новость
   */
  async create(
    createNewsDto: CreateNewsDto,
    currentUser: { sub: number; role: UserRole; agencyId?: number },
  ): Promise<News> {
    // Проверяем существование категории
    await this.categoriesService.findOne(createNewsDto.categoryId);

    let authorId = currentUser.sub;
    let agencyId = currentUser.agencyId;

    // Если пользователь - админ, он может создавать новости от имени других авторов
    if (currentUser.role === UserRole.ADMIN) {
      if (createNewsDto.authorId) {
        const author = await this.usersService.findOne(createNewsDto.authorId);
        if (author.role !== UserRole.AUTHOR) {
          throw new ForbiddenException(
            'Указанный пользователь не является автором',
          );
        }
        authorId = author.id;
      }

      if (createNewsDto.agencyId) {
        await this.agenciesService.findOne(createNewsDto.agencyId);
        agencyId = createNewsDto.agencyId;
      }
    }

    // Создаем новость
    const newNews = this.newsRepository.create({
      title: createNewsDto.title,
      content: createNewsDto.content,
      authorId,
      agencyId,
      categoryId: createNewsDto.categoryId,
      publishedAt: createNewsDto.publishedAt
        ? new Date(createNewsDto.publishedAt)
        : new Date(),
    });

    return this.newsRepository.save(newNews);
  }
  /**
   * Получение списка новостей с возможностью фильтрации
   * @param filterDto DTO с параметрами фильтрации
   * @returns Массив новостей
   */
  async findAll(filterDto?: NewsFilterDto): Promise<UnifiedNews[]> {
    const where: FindOptionsWhere<News> = {};

    // Применяем фильтры, если они указаны
    if (filterDto) {
      if (filterDto.categoryId) {
        where.categoryId = filterDto.categoryId;
      }

      if (filterDto.agencyId) {
        where.agencyId = filterDto.agencyId;
      }

      // Фильтрация по диапазону дат
      if (filterDto.startDate && filterDto.endDate) {
        // Если указаны обе даты, используем Between
        where.publishedAt = Between(
          new Date(filterDto.startDate),
          new Date(filterDto.endDate),
        );
      } else if (filterDto.startDate) {
        // Если указана только начальная дата
        where.publishedAt = MoreThanOrEqual(new Date(filterDto.startDate));
      } else if (filterDto.endDate) {
        // Если указана только конечная дата
        where.publishedAt = LessThanOrEqual(new Date(filterDto.endDate));
      }
    }

    let localNews: UnifiedNews[] = [];
    let externalNews: UnifiedNews[] = [];
    const sourceType = filterDto?.sourceType || 'all';

    if (sourceType === 'local' || sourceType === 'all') {
      const localNewsData = await this.newsRepository.find({
        where,
        relations: ['author', 'agency', 'category'],
        order: { publishedAt: 'DESC' },
      });
      // Помечаем локальные новости
      localNews = localNewsData.map(
        (n): UnifiedNews => ({
          ...n,
          isExternal: false,
          sourceType: 'local',
        }),
      );
    }

    if (sourceType === 'external' || sourceType === 'all') {
      externalNews = await this.externalNewsService.getTopHeadlines({
        country: 'us',
        pageSize: 10,
      });
    }

    // Объединяем и сортируем по дате публикации
    const allNews: UnifiedNews[] = [...localNews, ...externalNews];
    return allNews.sort((a, b) => {
      const dateA = a.createdAt || a.publishedAt || new Date(0);
      const dateB = b.createdAt || b.publishedAt || new Date(0);
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });
  }
  /**
   * Поиск новости по ID
   * @param id ID новости (число для локальных, строка для внешних)
   * @returns Найденная новость
   */
  async findOne(id: number | string): Promise<News | UnifiedNews> {
    // Если ID - число, ищем локальную новость
    if (typeof id === 'number' || !isNaN(Number(id))) {
      const numericId = typeof id === 'number' ? id : Number(id);
      const news = await this.newsRepository.findOne({
        where: { id: numericId },
        relations: ['author', 'agency', 'category'],
      });

      if (!news) {
        throw new NotFoundException(`Новость с ID ${id} не найдена`);
      }

      return news;
    } // Если ID - строка, ищем внешнюю новость через NewsAPI
    if (typeof id === 'string') {
      // Преобразуем ID обратно в поисковый запрос (заменяем _ на пробелы и берем только первое слово)
      const searchQuery = id.replace(/_/g, ' ').split(' ')[0];

      try {
        const externalNews = await this.externalNewsService.getTopHeadlines({
          q: searchQuery,
          pageSize: 20, // Увеличиваем размер для лучшего поиска
        });

        // Ищем новость с точно таким же ID
        const foundNews = externalNews[0];

        if (!foundNews) {
          throw new NotFoundException(`Внешняя новость с ID ${id} не найдена`);
        }

        return foundNews;
      } catch (error) {
        console.error('Ошибка при поиске внешней новости:', error);
        throw new NotFoundException(`Новость с ID ${id} не найдена`);
      }
    }

    throw new NotFoundException(`Новость с ID ${id} не найдена`);
  }
  /**
   * Обновление данных новости (только для локальных новостей)
   * @param id ID новости
   * @param updateNewsDto DTO с данными для обновления новости
   * @returns Обновленная новость
   */
  async update(id: number, updateNewsDto: UpdateNewsDto): Promise<News> {
    // Для обновления принимаем только числовой ID (локальные новости)
    const news = await this.newsRepository.findOne({
      where: { id },
      relations: ['author', 'agency', 'category'],
    });

    if (!news) {
      throw new NotFoundException(`Локальная новость с ID ${id} не найдена`);
    }

    // Проверяем существование категории, если она указана
    if (updateNewsDto.categoryId) {
      await this.categoriesService.findOne(updateNewsDto.categoryId);
    }

    // Создаем объект с обновляемыми данными
    const updatedData: Partial<News> = {};

    if (updateNewsDto.title) {
      updatedData.title = updateNewsDto.title;
    }

    if (updateNewsDto.content) {
      updatedData.content = updateNewsDto.content;
    }

    if (updateNewsDto.categoryId) {
      updatedData.categoryId = updateNewsDto.categoryId;
    }

    if (updateNewsDto.publishedAt) {
      updatedData.publishedAt = new Date(updateNewsDto.publishedAt);
    }

    // Обновляем данные
    this.newsRepository.merge(news, updatedData);
    return this.newsRepository.save(news);
  }
  /**
   * Удаление новости (только для локальных новостей)
   * @param id ID новости
   * @returns Результат удаления
   */
  async remove(id: number): Promise<void> {
    // Для удаления принимаем только числовой ID (локальные новости)
    const news = await this.newsRepository.findOne({
      where: { id },
      relations: ['author', 'agency', 'category'],
    });

    if (!news) {
      throw new NotFoundException(`Локальная новость с ID ${id} не найдена`);
    }

    await this.newsRepository.remove(news);
  }
}
