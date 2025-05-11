import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

/**
 * Запуск приложения
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Настройка глобальной валидации DTO
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // удаляет все свойства, которые не имеют декораторов
      forbidNonWhitelisted: true, // выдает ошибку, если в запросе есть лишние свойства
      transform: true, // автоматическое преобразование типов
    }),
  );

  // Настройка глобального префикса API
  app.setGlobalPrefix('api');

  // Включение CORS
  app.enableCors();

  // Запуск приложения на порту 3000
  await app.listen(3000);
  console.log(`Приложение запущено на порту 3000`);
}
bootstrap().catch((err) =>
  console.error('Ошибка при запуске приложения:', err),
);
