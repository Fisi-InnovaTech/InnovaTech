import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsInt,
} from 'class-validator';

export class RegisterAuthDto {
  @ApiProperty({
    example: 'usuario@email.com',
    description: 'Correo electrónico único del usuario',
    format: 'email',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'SuperSecreto123',
    description: 'Contraseña del usuario (mínimo 8 caracteres)',
    minLength: 8,
  })
  @MinLength(8)
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: 'Juan',
    description: 'Nombres del usuario',
  })
  @IsNotEmpty()
  @IsString()
  nombres: string;

  @ApiProperty({
    example: 'Pérez Gómez',
    description: 'Apellidos del usuario',
  })
  @IsNotEmpty()
  @IsString()
  apellidos: string;

  @ApiProperty({
    example: 12345678,
    description: 'Número de DNI del usuario (7 a 8 dígitos)',
    minimum: 1000000,
    maximum: 99999999,
    type: Number,
  })
  @IsNotEmpty()
  @IsInt()
  dni: number; // 👈 ahora es número

  @ApiProperty({
    example: '1990-01-01',
    description: 'Fecha de nacimiento en formato YYYY-MM-DD',
    type: String,
    format: 'date',
  })
  @IsNotEmpty()
  @IsDateString()
  fechaNacimiento: string; // 👈 mismo nombre que en Prisma
}
