import { IsString, MinLength } from 'class-validator';

export class CreateAuthDto {
  @IsString()
  @MinLength(3)
  name!: string;

  @IsString()
  @MinLength(3)
  lastName!: string;

  @IsString()
  @MinLength(3)
  password!: string;

  @IsString()
  @MinLength(3)
  email!: string;
}
