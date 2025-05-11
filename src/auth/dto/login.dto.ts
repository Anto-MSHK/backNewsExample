import { IsNotEmpty, IsString, MinLength } from 'class-validator';

/**
 * DTO для запроса на аутентификацию пользователя
 */
export class LoginDto {
  /**
   * Имя пользователя
   */
  @IsNotEmpty({ message: 'Имя пользователя не может быть пустым' })
  @IsString({ message: 'Имя пользователя должно быть строкой' })
  username: string;

  /**
   * Пароль
   */
  @IsNotEmpty({ message: 'Пароль не может быть пустым' })
  @IsString({ message: 'Пароль должен быть строкой' })
  @MinLength(6, { message: 'Пароль должен содержать минимум 6 символов' })
  password: string;
}
