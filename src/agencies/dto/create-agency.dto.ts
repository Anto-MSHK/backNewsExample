import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

/**
 * DTO для создания нового агентства
 */
export class CreateAgencyDto {
  /**
   * Название агентства
   */
  @IsNotEmpty({ message: 'Название агентства не может быть пустым' })
  @IsString({ message: 'Название агентства должно быть строкой' })
  name: string;

  /**
   * Описание агентства (необязательное поле)
   */
  @IsOptional()
  @IsString({ message: 'Описание агентства должно быть строкой' })
  description?: string;
}
