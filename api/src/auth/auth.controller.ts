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
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { Response } from 'express';
import { clearLoginCookie, setLoginCookie } from './auth.cookie.js';
import { AuthGuard, type AuthenticatedRequest } from './auth.guard.js';
import { AuthService } from './auth.service.js';
import { LoginDto } from './login.dto.js';
import { RegisterDto } from './register.dto.js';
import { UserDto } from './user.dto.js';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Registration: become a User',
    description:
      'Returns the new User. It does not log them in: call Login next.',
  })
  @ApiCreatedResponse({ type: UserDto })
  @ApiBadRequestResponse({ description: 'Malformed email or password.' })
  @ApiConflictResponse({ description: 'The email is already registered.' })
  register(@Body() dto: RegisterDto) {
    return this.auth.register(dto.email, dto.password);
  }

  @Post('login')
  @ApiOperation({
    summary: 'Login with email and password',
    description: 'Sets the HttpOnly login cookie and returns the User.',
  })
  @ApiOkResponse({ type: UserDto })
  @ApiBadRequestResponse({ description: 'Malformed email or password.' })
  @ApiUnauthorizedResponse({ description: 'Wrong email or password.' })
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
  @ApiOperation({ summary: 'Logout by clearing the login cookie' })
  @HttpCode(204)
  logout(@Res({ passthrough: true }) res: Response) {
    clearLoginCookie(res);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'The logged-in User' })
  @ApiCookieAuth()
  @ApiOkResponse({ type: UserDto })
  @ApiUnauthorizedResponse({
    description: 'No valid login cookie. Call Login first.',
  })
  me(@Req() req: AuthenticatedRequest) {
    return this.auth.me(req.userId);
  }
}
