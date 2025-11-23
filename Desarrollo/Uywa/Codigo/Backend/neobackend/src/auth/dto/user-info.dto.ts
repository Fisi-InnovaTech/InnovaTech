// dto/user-info.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class UserInfoDto {
  @ApiProperty({
    example: 'juan@example.com',
    description: 'Email del usuario',
  })
  email: string;

  @ApiProperty({
    example: 'Juan',
    description: 'Nombres del usuario',
  })
  nombres: string;

  @ApiProperty({
    example: 'Pérez',
    description: 'Apellidos del usuario',
  })
  apellidos: string;

  @ApiProperty({
    example: 'usuario',
    description: 'Rol del usuario',
  })
  rol?: string;

  @ApiProperty({
    example: 1,
    description: 'ID del usuario',
  })
  id?: number;
}
