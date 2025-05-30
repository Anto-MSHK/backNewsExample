import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../../users/services/users.service';
import { LoginDto } from '../dto/login.dto';
import { LoginResponseDto } from '../dto/login-response.dto';
import { JwtPayloadDto } from '../dto/jwt-payload.dto';
import { RegisterDto } from '../dto/register.dto';
import { RegisterResponseDto } from '../dto/register-response.dto';
import { UserRole } from '../../common/enums/user-role.enum';

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
   * Регистрация нового пользователя
   * @param registerDto DTO с данными для регистрации
   * @returns Объект с данными пользователя и JWT токеном
   */
  async register(registerDto: RegisterDto): Promise<RegisterResponseDto> {
    // Создаем нового пользователя с ролью READER по умолчанию
    const newUser = await this.usersService.create({
      username: registerDto.username,
      password: registerDto.password,
      email: registerDto.email,
      role: UserRole.READER, // По умолчанию все новые пользователи - читатели
    });

    // Создаем JWT токен для автоматической авторизации
    const payload: JwtPayloadDto = {
      sub: newUser.id,
      username: newUser.username,
      role: newUser.role,
      agencyId: newUser.agencyId as number,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      accessToken,
      message: 'Пользователь успешно зарегистрирован',
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
