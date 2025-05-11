import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConfig } from '../../config/jwt.config';
import { JwtPayloadDto } from '../dto/jwt-payload.dto';

/**
 * Стратегия для работы с JWT токенами
 * Используется для аутентификации пользователей по JWT токену
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConfig.secret || 'fallback-secret',
    });
  }

  /**
   * Валидирует полезную нагрузку JWT токена
   * @param payload Полезная нагрузка токена
   * @returns Объект пользователя, который будет доступен в request.user
   */
  validate(payload: JwtPayloadDto): any {
    return {
      sub: payload.sub,
      username: payload.username,
      role: payload.role,
      agencyId: payload.agencyId,
    };
  }
}
