import { IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsString()
  @MinLength(3)
  email!: string;

  @IsString()
  @MinLength(3)
  password!: string;
}
