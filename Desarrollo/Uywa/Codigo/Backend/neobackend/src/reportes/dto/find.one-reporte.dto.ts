import { IsInt, Min } from 'class-validator';

import { Type } from 'class-transformer';

export class FindOneReporteDto {
  @Type(() => Number)
  @IsInt({ message: 'El ID debe ser un número entero' })
  @Min(1, { message: 'El ID debe ser mayor a 0' })
  id: number;
}
