import { IsNotEmpty, IsString } from 'class-validator';

export class CreateServerDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;
}
