import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({
    example: 'usuario@email.com',
    description: 'Correo electrónico del usuario',
  })
  email: string;

  @ApiProperty({
    example: 'Juan',
    description: 'Nombres del usuario',
  })
  nombres: string;

  @ApiProperty({
    example: 'Pérez Gómez',
    description: 'Apellidos del usuario',
  })
  apellidos: string;

  @ApiProperty({
    example: 'Admin',
    description: 'Rol del usuario',
  })
  rol: string;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Token JWT de acceso',
  })
  access_token?: string;
}
