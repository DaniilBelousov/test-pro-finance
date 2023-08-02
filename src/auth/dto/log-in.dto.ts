import { IsString, IsNotEmpty } from 'class-validator';

export class LogInDto {
  @IsString()
  @IsNotEmpty()
  nickname: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
