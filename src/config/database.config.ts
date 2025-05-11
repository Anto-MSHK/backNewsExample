import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { config } from 'dotenv';

config();

/**
 * Конфигурация подключения к базе данных PostgreSQL
 */
export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'news_api',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: process.env.NODE_ENV !== 'production', // автоматическое создание таблиц (только для разработки)
  logging: process.env.NODE_ENV !== 'production',
};
