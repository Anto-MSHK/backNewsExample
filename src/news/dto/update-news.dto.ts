import { IsDateString, IsOptional, IsString } from 'class-validator';

/**
 * DTO для обновления существующей новости
 */
export class UpdateNewsDto {
  /**
   * Заголовок новости
   */
  @IsOptional()
  @IsString({ message: 'Заголовок новости должен быть строкой' })
  title?: string;

  /**
   * Содержание новости
   */
  @IsOptional()
  @IsString({ message: 'Содержание новости должно быть строкой' })
  content?: string;

  /**
   * Время публикации
   */
  @IsOptional()
  @IsDateString({}, { message: 'Некорректный формат даты публикации' })
  publishedAt?: string;

  /**
   * ID категории новости
   */
  @IsOptional()
  categoryId?: number;
}
