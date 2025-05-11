import { UserRole } from '../../common/enums/user-role.enum';

/**
 * DTO для ответа после аутентификации
 */
export class JwtPayloadDto {
  /**
   * ID пользователя
   */
  sub: number;

  /**
   * Имя пользователя
   */
  username: string;

  /**
   * Роль пользователя
   */
  role: UserRole;

  /**
   * ID агентства, к которому принадлежит пользователь
   */
  agencyId?: number;
}
