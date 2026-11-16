import { IsEmail, IsString, Length, MaxLength } from 'class-validator';
import { NormaliseEmail } from './normalise-email.js';

export class RegisterDto {
  @NormaliseEmail()
  @IsEmail()
  @MaxLength(254)
  email: string;

  @IsString()
  @Length(8, 128)
  password: string;
}
