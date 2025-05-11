import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { UserRole } from '../../common/enums/user-role.enum';

/**
 * DTO для создания нового пользователя
 */
export class CreateUserDto {
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

  /**
   * Email пользователя
   */
  @IsOptional()
  @IsEmail({}, { message: 'Некорректный формат email' })
  email?: string;

  /**
   * Роль пользователя
   */
  @IsEnum(UserRole, { message: 'Некорректная роль пользователя' })
  role: UserRole;

  /**
   * ID агентства, к которому принадлежит пользователь
   */
  @IsOptional()
  agencyId?: number;
}
