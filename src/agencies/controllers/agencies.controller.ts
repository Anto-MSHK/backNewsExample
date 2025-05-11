import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { AgenciesService } from '../services/agencies.service';
import { CreateAgencyDto } from '../dto/create-agency.dto';
import { UpdateAgencyDto } from '../dto/update-agency.dto';
import { Agency } from '../entities/agency.entity';

/**
 * Контроллер для работы с агентствами
 */
@Controller('agencies')
export class AgenciesController {
  constructor(private readonly agenciesService: AgenciesService) {}

  /**
   * Создание нового агентства
   * @param createAgencyDto DTO с данными для создания агентства
   * @returns Созданное агентство
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async create(@Body() createAgencyDto: CreateAgencyDto): Promise<Agency> {
    return this.agenciesService.create(createAgencyDto);
  }

  /**
   * Получение списка всех агентств
   * @returns Массив агентств
   */
  @Get()
  async findAll(): Promise<Agency[]> {
    return this.agenciesService.findAll();
  }

  /**
   * Получение информации об агентстве по ID
   * @param id ID агентства
   * @returns Агентство
   */
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Agency> {
    return this.agenciesService.findOne(+id);
  }

  /**
   * Обновление данных агентства
   * @param id ID агентства
   * @param updateAgencyDto DTO с данными для обновления агентства
   * @returns Обновленное агентство
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateAgencyDto: UpdateAgencyDto,
  ): Promise<Agency> {
    return this.agenciesService.update(+id, updateAgencyDto);
  }

  /**
   * Удаление агентства
   * @param id ID агентства
   * @returns Результат удаления
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async remove(@Param('id') id: string): Promise<void> {
    return this.agenciesService.remove(+id);
  }
}
