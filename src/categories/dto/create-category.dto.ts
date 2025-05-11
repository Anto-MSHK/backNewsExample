import { IsNotEmpty, IsString } from 'class-validator';

/**
 * DTO для создания новой категории
 */
export class CreateCategoryDto {
  /**
   * Название категории
   */
  @IsNotEmpty({ message: 'Название категории не может быть пустым' })
  @IsString({ message: 'Название категории должно быть строкой' })
  name: string;
}
