import { JwtModuleOptions } from '@nestjs/jwt';

/**
 * Конфигурация JWT для аутентификации
 */
export const jwtConfig: JwtModuleOptions = {
  secret: process.env.JWT_SECRET || 'supersecretkey',
  signOptions: {
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },
};
