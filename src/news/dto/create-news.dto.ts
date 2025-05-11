import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

/**
 * DTO для создания новой новости
 */
export class CreateNewsDto {
  /**
   * Заголовок новости
   */
  @IsNotEmpty({ message: 'Заголовок новости не может быть пустым' })
  @IsString({ message: 'Заголовок новости должен быть строкой' })
  title: string;

  /**
   * Содержание новости
   */
  @IsNotEmpty({ message: 'Содержание новости не может быть пустым' })
  @IsString({ message: 'Содержание новости должно быть строкой' })
  content: string;

  /**
   * Время публикации (необязательное поле, используется для отложенной публикации)
   */
  @IsOptional()
  @IsDateString({}, { message: 'Некорректный формат даты публикации' })
  publishedAt?: string;

  /**
   * ID категории новости
   */
  @IsNotEmpty({ message: 'ID категории не может быть пустым' })
  @IsNumber({}, { message: 'ID категории должен быть числом' })
  categoryId: number;

  /**
   * ID автора новости (используется, когда админ создает новость от имени другого автора)
   */
  @IsOptional()
  @IsNumber({}, { message: 'ID автора должен быть числом' })
  authorId?: number;

  /**
   * ID агентства новости (используется, когда админ создает новость от имени другого агентства)
   */
  @IsOptional()
  @IsNumber({}, { message: 'ID агентства должен быть числом' })
  agencyId?: number;
}
