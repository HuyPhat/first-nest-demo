import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { clearLoginCookie, setLoginCookie } from './auth.cookie.js';
import { AuthGuard, type AuthenticatedRequest } from './auth.guard.js';
import { AuthService } from './auth.service.js';
import { LoginDto } from './login.dto.js';
import { RegisterDto } from './register.dto.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, token } = await this.auth.register(dto.email, dto.password);
    setLoginCookie(res, token);
    return user;
  }

  @Post('login')
  @HttpCode(200)
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, token } = await this.auth.login(dto.email, dto.password);
    setLoginCookie(res, token);
    return user;
  }

  @Post('logout')
  @HttpCode(204)
  logout(@Res({ passthrough: true }) res: Response) {
    clearLoginCookie(res);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  me(@Req() req: AuthenticatedRequest) {
    return this.auth.me(req.userId);
  }
}
