import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../../users/services/users.service';
import { LoginDto } from '../dto/login.dto';
import { LoginResponseDto } from '../dto/login-response.dto';
import { JwtPayloadDto } from '../dto/jwt-payload.dto';

/**
 * Сервис для работы с аутентификацией
 */
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  /**
   * Авторизация пользователя
   * @param loginDto DTO с данными для входа
   * @returns Объект с JWT токеном
   */
  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const user = await this.validateUser(loginDto.username, loginDto.password);

    const payload: JwtPayloadDto = {
      sub: user.id,
      username: user.username,
      role: user.role,
      agencyId: user.agencyId,
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  /**
   * Валидация пользователя по имени и паролю
   * @param username Имя пользователя
   * @param password Пароль
   * @returns Объект пользователя без пароля
   */
  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);

    if (!user) {
      throw new UnauthorizedException('Неверные учетные данные');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Неверные учетные данные');
    }

    // Исключаем пароль из результата
    const { passwordHash, ...result } = user;
    return result;
  }
}
