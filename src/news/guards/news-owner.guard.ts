import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { NewsService } from '../../news/services/news.service';
import { UserRole } from '../../common/enums/user-role.enum';

/**
 * Guards для проверки авторства новостей
 * Используется для проверки, является ли пользователь автором новости при операциях редактирования/удаления
 */
@Injectable()
export class NewsOwnerGuard implements CanActivate {
  constructor(private newsService: NewsService) {}

  /**
   * Проверяет, является ли пользователь автором новости или администратором
   * @param context Контекст выполнения
   * @returns true, если доступ разрешен, иначе выбрасывает исключение
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const newsId = parseInt(request.params.id);

    // Администраторы могут редактировать/удалять любые новости
    if (user.role === UserRole.ADMIN) {
      return true;
    }

    // Для авторов проверяем, что они являются создателями новости
    if (user.role === UserRole.AUTHOR) {
      const news = await this.newsService.findOne(newsId);
      if (!news) {
        throw new ForbiddenException('Новость не найдена');
      }

      // Проверяем, является ли пользователь автором новости
      if (news.authorId === user.sub) {
        return true;
      }
    }

    throw new ForbiddenException(
      'У вас нет прав для редактирования этой новости',
    );
  }
}
