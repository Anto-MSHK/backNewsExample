import { IsNotEmpty, IsString } from 'class-validator';

/**
 * DTO для обновления существующей категории
 */
export class UpdateCategoryDto {
  /**
   * Название категории
   */
  @IsNotEmpty({ message: 'Название категории не может быть пустым' })
  @IsString({ message: 'Название категории должно быть строкой' })
  name: string;
}
