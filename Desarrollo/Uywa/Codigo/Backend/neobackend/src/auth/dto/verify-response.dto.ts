import { ApiProperty } from '@nestjs/swagger';

export class VerifyResponseDto {
  @ApiProperty({ example: true })
  valid: boolean;

  @ApiProperty({
    example: {
      id: 1,
      email: 'usuario@ejemplo.com',
      rol: 'user',
    },
  })
  user?: any;

  @ApiProperty({ example: 'Token válido' })
  message: string;
}

// dto/me-response.dto.ts
export class MeResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'usuario@ejemplo.com' })
  email: string;

  @ApiProperty({ example: 'Juan' })
  nombres: string;

  @ApiProperty({ example: 'Pérez' })
  apellidos: string;

  @ApiProperty({ example: 'user' })
  rol: string;

  @ApiProperty({ example: '1990-01-01T00:00:00.000Z' })
  fechaNacimiento: Date;
}
