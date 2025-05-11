import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AgenciesModule } from './agencies/agencies.module';
import { CategoriesModule } from './categories/categories.module';
import { NewsModule } from './news/news.module';
import { databaseConfig } from './config/database.config';

/**
 * Главный модуль приложения
 * Объединяет все модули системы
 */
@Module({
  imports: [
    // Подключение к базе данных
    TypeOrmModule.forRoot(databaseConfig),
    // Подключение модулей приложения
    AuthModule,
    UsersModule,
    AgenciesModule,
    CategoriesModule,
    NewsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
