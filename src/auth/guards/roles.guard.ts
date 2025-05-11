import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from 'src/common/enums/user-role.enum';

/**
 * Guards для проверки ролей пользователей
 * Используется для ограничения доступа к эндпоинтам в зависимости от роли пользователя
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  /**
   * Проверяет, имеет ли пользователь доступ к маршруту
   * @param context Контекст выполнения
   * @returns true, если доступ разрешен, иначе false
   */
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      'roles',
      [context.getHandler(), context.getClass()],
    );

    // Если роли не указаны, доступ разрешен
    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    // Проверяем наличие пользователя и соответствие его роли требуемым ролям
    return requiredRoles.some((role) => user.role === role);
  }
}
