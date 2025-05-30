import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { News } from './entities/news.entity';
import { NewsService } from './services/news.service';
import { NewsController } from './controllers/news.controller';
import { UsersModule } from '../users/users.module';
import { CategoriesModule } from '../categories/categories.module';
import { AgenciesModule } from '../agencies/agencies.module';
import { ExternalNewsService } from './services/external-news.service';

/**
 * Модуль новостей
 * Отвечает за управление новостями системы
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([News]),
    UsersModule,
    CategoriesModule,
    AgenciesModule,
  ],
  controllers: [NewsController],
  providers: [NewsService, ExternalNewsService],
  exports: [NewsService],
})
export class NewsModule {}
