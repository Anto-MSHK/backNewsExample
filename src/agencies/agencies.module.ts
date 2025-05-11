import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agency } from './entities/agency.entity';
import { AgenciesService } from './services/agencies.service';
import { AgenciesController } from './controllers/agencies.controller';

/**
 * Модуль агентств
 * Отвечает за управление новостными агентствами
 */
@Module({
  imports: [TypeOrmModule.forFeature([Agency])],
  controllers: [AgenciesController],
  providers: [AgenciesService],
  exports: [AgenciesService],
})
export class AgenciesModule {}
