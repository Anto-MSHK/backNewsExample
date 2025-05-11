import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../common/enums/user-role.enum';

/**
 * Декоратор для определения ролей, имеющих доступ к методу или контроллеру
 * @param roles Массив ролей, которым разрешен доступ
 */
export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
