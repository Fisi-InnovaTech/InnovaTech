import { 
    IsInt, 
    Min 
} from 'class-validator';

export class FindOneReporteDto {
  @IsInt({ message: 'El ID debe ser un número entero' })
  @Min(1, { message: 'El ID debe ser mayor a 0' })
  id: number;
}