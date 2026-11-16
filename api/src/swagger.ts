import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ACCESS_TOKEN_COOKIE } from './auth/auth.cookie.js';

/** Serves Swagger UI at /docs and the OpenAPI document at /docs-json. */
export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('First Nest Demo API')
    .setDescription(
      'Registration, Login, Logout and Me for Users. ' +
        'To try Me in Swagger UI, call Login first: Swagger UI cannot set the HttpOnly ' +
        'login cookie itself, so the browser keeps the cookie that Login returns.',
    )
    .addCookieAuth(ACCESS_TOKEN_COOKIE)
    .build();
  SwaggerModule.setup('docs', app, SwaggerModule.createDocument(app, config));
}
