import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guard для JWT аутентификации
 * Проверяет наличие и валидность JWT токена
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
