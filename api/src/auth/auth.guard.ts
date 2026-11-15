import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import { ACCESS_TOKEN_COOKIE } from './auth.cookie.js';

export type AuthenticatedRequest = Request & { userId: string };

/** Lets a request through when its login cookie holds a valid token; sets `userId`. */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = new RegExp(`(?:^|;\\s*)${ACCESS_TOKEN_COOKIE}=([^;]+)`).exec(
      req.headers.cookie ?? '',
    )?.[1];
    if (!token) throw new UnauthorizedException();
    try {
      req.userId = (await this.jwt.verifyAsync<{ sub: string }>(token)).sub;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }
}
