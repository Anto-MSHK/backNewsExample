import { Controller, Post, Body, HttpCode, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { LoginResponseDto } from '../dto/login-response.dto';

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
}
