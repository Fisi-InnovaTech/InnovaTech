import { ApiProperty } from '@nestjs/swagger';

export class ResponseAuthDto {
  @ApiProperty({
    example: 'usuario@email.com',
    description: 'Correo electrónico único del usuario',
    format: 'email',
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
}
