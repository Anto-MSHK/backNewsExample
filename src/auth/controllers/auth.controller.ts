import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { LoginResponseDto } from '../dto/login-response.dto';
import { RegisterDto } from '../dto/register.dto';
import { RegisterResponseDto } from '../dto/register-response.dto';

/**
 * Контроллер для работы с аутентификацией
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  /**
   * Аутентификация пользователя
   * @param loginDto DTO с данными для входа
   * @returns Объект с JWT токеном
   */
  @Post('login')
  @HttpCode(200)
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    return this.authService.login(loginDto);
  }

  /**
   * Регистрация нового пользователя
   * @param registerDto DTO с данными для регистрации
   * @returns Объект с данными пользователя и JWT токеном
   */
  @Post('register')
  @HttpCode(201)
  async register(
    @Body() registerDto: RegisterDto,
  ): Promise<RegisterResponseDto> {
    return this.authService.register(registerDto);
  }
}
