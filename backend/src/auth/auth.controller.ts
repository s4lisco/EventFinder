import { Controller, Post, Body, Request, UseGuards, Get, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Registriert einen neuen Benutzer (Rolle: 'USER')
   */
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    try {
      return await this.authService.register(registerDto);
    } catch (error) {
      console.error('Registration error:', error);
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.message,
          error: error.response?.message || error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Login (gibt ein JWT-Token zurück)
   */
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Request() req) {
    try {
      return this.authService.login(req.user);
    } catch (error) {
      throw new HttpException('Login failed', HttpStatus.UNAUTHORIZED);
    }
  }

  /**
   * Holt das Profil des aktuell angemeldeten Benutzers
   */
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}