import { ConflictException, Injectable } from '@nestjs/common';
import { InjectDrizzle } from '@nestjs/drizzle';
import * as argon2 from 'argon2';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { users } from '../db/schema.js';

@Injectable()
export class AuthService {
  constructor(@InjectDrizzle() private readonly db: NodePgDatabase) {}

  async register(email: string, password: string) {
    const passwordHash = await argon2.hash(password);
    const [user] = await this.db
      .insert(users)
      .values({ email, passwordHash })
      .onConflictDoNothing({ target: users.email })
      .returning({ id: users.id, email: users.email });
    if (!user) throw new ConflictException('Email is already registered');
    return user;
  }
}
