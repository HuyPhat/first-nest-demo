import { IsString, MaxLength } from 'class-validator';
import { NormaliseEmail } from './normalise-email.js';

// No format or minimum-length rules: Login only answers "right credentials or not".
// The length caps bound the work argon2 does on hostile input.
export class LoginDto {
  @NormaliseEmail()
  @IsString()
  @MaxLength(254)
  email: string;

  @IsString()
  @MaxLength(128)
  password: string;
}
