import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginAuthDto {
  @ApiProperty({
    example: 'usuario@email.com',
    description: 'Correo electrónico único del usuario',
    format: 'email',
  })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    example: 'SuperSecreto123',
    description: 'Contraseña del usuario (mínimo 8 caracteres)',
    minLength: 8,
  })
  email: string;
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
