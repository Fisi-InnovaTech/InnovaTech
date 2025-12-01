import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsIn, // ✅ Asegúrate de tener esta importación
  IsDateString,
} from 'class-validator';

export class CreateReporteDto {
  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  usuarioId: number;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  latitud: number;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  longitud: number;

  @IsString()
  @IsOptional()
  @IsIn(['pendiente', 'en_proceso', 'resuelto', 'rechazado'])
  estado?: string;

  @IsString()
  @IsOptional()
  imagen_url?: string; // ✅ Para URLs manuales (sin archivo)

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  animal_id: number;

  @IsOptional()
  @IsDateString()
  fecha_creacion?: string;
}
