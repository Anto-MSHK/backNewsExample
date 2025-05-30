import {
  IsDateString,
  IsNumberString,
  IsOptional,
  IsIn,
} from 'class-validator';

/**
 * DTO для фильтрации новостей по различным параметрам
 */
export class NewsFilterDto {
  /**
   * ID категории для фильтрации новостей
   */
  @IsOptional()
  @IsNumberString({}, { message: 'ID категории должен быть числом' })
  categoryId?: number;

  /**
   * ID агентства для фильтрации новостей
   */
  @IsOptional()
  @IsNumberString({}, { message: 'ID агентства должен быть числом' })
  agencyId?: number;

  /**
   * Дата начала периода для фильтрации
   */
  @IsOptional()
  @IsDateString({}, { message: 'Некорректный формат начальной даты' })
  startDate?: string;

  /**
   * Дата окончания периода для фильтрации
   */
  @IsOptional()
  @IsDateString({}, { message: 'Некорректный формат конечной даты' })
  endDate?: string;
  /**
   * Тип источника: local, external, all
   */
  @IsOptional()
  @IsIn(['local', 'external', 'all'], {
    message: 'Тип источника должен быть local, external или all',
  })
  sourceType?: 'local' | 'external' | 'all';
}
