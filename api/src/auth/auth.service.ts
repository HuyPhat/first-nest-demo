import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectDrizzle } from '@nestjs/drizzle';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { eq } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { users } from '../db/schema.js';

// Verified against when the email is unknown, so Login takes as long either way
// and response time doesn't reveal which emails are registered.
const UNKNOWN_USER_HASH = await argon2.hash('unknown user');

@Injectable()
export class AuthService {
  constructor(
    @InjectDrizzle() private readonly db: NodePgDatabase,
    private readonly jwt: JwtService,
  ) {}

  async register(email: string, password: string) {
    const passwordHash = await argon2.hash(password);
    const [user] = await this.db
      .insert(users)
      .values({ email, passwordHash })
      .onConflictDoNothing({ target: users.email })
      .returning({ id: users.id, email: users.email });
    if (!user) throw new ConflictException('Email is already registered');
    return { user, token: await this.jwt.signAsync({ sub: user.id }) };
  }

  async login(email: string, password: string) {
    const [row] = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email));
    const valid = await argon2.verify(
      row?.passwordHash ?? UNKNOWN_USER_HASH,
      password,
    );
    if (!row || !valid)
      throw new UnauthorizedException('Invalid email or password');
    const user = { id: row.id, email: row.email };
    return { user, token: await this.jwt.signAsync({ sub: user.id }) };
  }

  async me(id: string) {
    const [user] = await this.db
      .select({ id: users.id, email: users.email })
      .from(users)
      .where(eq(users.id, id));
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
