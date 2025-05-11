import { NestFactory } from '@nestjs/core';
import * as bcrypt from 'bcrypt';
import { AppModule } from '../app.module';
import { UsersService } from '../users/services/users.service';
import { AgenciesService } from '../agencies/services/agencies.service';
import { CategoriesService } from '../categories/services/categories.service';
import { UserRole } from '../common/enums/user-role.enum';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { CreateAgencyDto } from '../agencies/dto/create-agency.dto';
import { CreateCategoryDto } from '../categories/dto/create-category.dto';

/**
 * Скрипт для инициализации базы данных начальными данными
 * Создает администратора, агентства, категории и авторов
 */
async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const usersService = app.get(UsersService);
  const agenciesService = app.get(AgenciesService);
  const categoriesService = app.get(CategoriesService);

  try {
    console.log('Начало инициализации базы данных...');

    // Создаем администратора
    const adminDto: CreateUserDto = {
      username: 'admin',
      password: 'admin123',
      email: 'admin@example.com',
      role: UserRole.ADMIN,
    };

    try {
      const admin = await usersService.create(adminDto);
      console.log(`Создан администратор: ${admin.username}`);
    } catch (error) {
      console.log(
        'Администратор уже существует или произошла ошибка при создании',
      );
    }

    // Создаем агентства
    const agencies = [
      { name: 'Новости 24', description: 'Круглосуточные новости' },
      { name: 'Спорт Инфо', description: 'Спортивные новости и аналитика' },
      { name: 'Мир Технологий', description: 'Новости из мира технологий' },
    ];

    for (const agencyData of agencies) {
      const agencyDto: CreateAgencyDto = {
        name: agencyData.name,
        description: agencyData.description,
      };

      try {
        const agency = await agenciesService.create(agencyDto);
        console.log(`Создано агентство: ${agency.name}`);
      } catch (error) {
        console.log(
          `Агентство ${agencyData.name} уже существует или произошла ошибка при создании`,
        );
      }
    }

    // Создаем категории
    const categories = [
      { name: 'Политика' },
      { name: 'Экономика' },
      { name: 'Спорт' },
      { name: 'Технологии' },
      { name: 'Культура' },
      { name: 'Наука' },
    ];

    for (const categoryData of categories) {
      const categoryDto: CreateCategoryDto = {
        name: categoryData.name,
      };

      try {
        const category = await categoriesService.create(categoryDto);
        console.log(`Создана категория: ${category.name}`);
      } catch (error) {
        console.log(
          `Категория ${categoryData.name} уже существует или произошла ошибка при создании`,
        );
      }
    }

    // Получаем созданные агентства для создания авторов
    const allAgencies = await agenciesService.findAll();

    // Создаем авторов для каждого агентства
    if (allAgencies.length > 0) {
      const authors = [
        {
          username: 'author1',
          password: 'password1',
          email: 'author1@example.com',
          agencyId: allAgencies[0].id,
        },
        {
          username: 'author2',
          password: 'password2',
          email: 'author2@example.com',
          agencyId: allAgencies[0].id,
        },
        {
          username: 'author3',
          password: 'password3',
          email: 'author3@example.com',
          agencyId: allAgencies[1].id,
        },
      ];

      for (const authorData of authors) {
        const authorDto: CreateUserDto = {
          username: authorData.username,
          password: authorData.password,
          email: authorData.email,
          role: UserRole.AUTHOR,
          agencyId: authorData.agencyId,
        };

        try {
          const author = await usersService.create(authorDto);
          console.log(
            `Создан автор: ${author.username} (агентство ID: ${author.agencyId})`,
          );
        } catch (error) {
          console.log(
            `Автор ${authorData.username} уже существует или произошла ошибка при создании`,
          );
        }
      }
    }

    console.log('Инициализация базы данных завершена');
  } catch (error) {
    console.error('Ошибка при инициализации базы данных:', error);
  } finally {
    await app.close();
  }
}

bootstrap();
