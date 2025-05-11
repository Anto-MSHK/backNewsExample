import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agency } from '../entities/agency.entity';
import { CreateAgencyDto } from '../dto/create-agency.dto';
import { UpdateAgencyDto } from '../dto/update-agency.dto';

/**
 * Сервис для работы с агентствами
 */
@Injectable()
export class AgenciesService {
  constructor(
    @InjectRepository(Agency)
    private agenciesRepository: Repository<Agency>,
  ) {}

  /**
   * Создание нового агентства
   * @param createAgencyDto DTO с данными для создания агентства
   * @returns Созданное агентство
   */
  async create(createAgencyDto: CreateAgencyDto): Promise<Agency> {
    // Проверяем, существует ли агентство с таким названием
    const existingAgency = await this.agenciesRepository.findOne({
      where: { name: createAgencyDto.name },
    });

    if (existingAgency) {
      throw new ConflictException('Агентство с таким названием уже существует');
    }

    const newAgency = this.agenciesRepository.create(createAgencyDto);
    return this.agenciesRepository.save(newAgency);
  }

  /**
   * Получение всех агентств
   * @returns Массив агентств
   */
  async findAll(): Promise<Agency[]> {
    return this.agenciesRepository.find();
  }

  /**
   * Поиск агентства по ID
   * @param id ID агентства
   * @returns Найденное агентство
   */
  async findOne(id: number): Promise<Agency> {
    const agency = await this.agenciesRepository.findOne({
      where: { id },
      relations: ['users'],
    });

    if (!agency) {
      throw new NotFoundException(`Агентство с ID ${id} не найдено`);
    }

    return agency;
  }

  /**
   * Обновление данных агентства
   * @param id ID агентства
   * @param updateAgencyDto DTO с данными для обновления агентства
   * @returns Обновленное агентство
   */
  async update(id: number, updateAgencyDto: UpdateAgencyDto): Promise<Agency> {
    const agency = await this.findOne(id);

    // Если обновляется название, проверяем уникальность
    if (updateAgencyDto.name && updateAgencyDto.name !== agency.name) {
      const existingAgency = await this.agenciesRepository.findOne({
        where: { name: updateAgencyDto.name },
      });

      if (existingAgency) {
        throw new ConflictException(
          'Агентство с таким названием уже существует',
        );
      }
    }

    // Обновляем данные
    this.agenciesRepository.merge(agency, updateAgencyDto);
    return this.agenciesRepository.save(agency);
  }

  /**
   * Удаление агентства
   * @param id ID агентства
   * @returns Результат удаления
   */
  async remove(id: number): Promise<void> {
    const agency = await this.findOne(id);
    await this.agenciesRepository.remove(agency);
  }
}
