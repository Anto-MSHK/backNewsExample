import { UserRole } from '../../common/enums/user-role.enum';

/**
 * DTO для ответа после успешной регистрации
 */
export class RegisterResponseDto {
  /**
   * ID созданного пользователя
   */
  id: number;

  /**
   * Имя пользователя
   */
  username: string;

  /**
   * Email пользователя
   */
  email?: string;

  /**
   * Роль пользователя
   */
  role: UserRole;

  /**
   * JWT токен для автоматической авторизации
   */
  accessToken: string;

  /**
   * Сообщение об успешной регистрации
   */
  message: string;
}
