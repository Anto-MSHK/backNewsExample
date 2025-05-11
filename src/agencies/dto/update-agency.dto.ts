import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

/**
 * DTO для обновления существующего агентства
 */
export class UpdateAgencyDto {
  /**
   * Название агентства
   */
  @IsOptional()
  @IsString({ message: 'Название агентства должно быть строкой' })
  name?: string;

  /**
   * Описание агентства
   */
  @IsOptional()
  @IsString({ message: 'Описание агентства должно быть строкой' })
  description?: string;
}
