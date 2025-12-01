import { PartialType } from '@nestjs/mapped-types';
import { CreateReporteDto } from './create-reporte.dto';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsIn, // ✅ Agregar esta importación
} from 'class-validator';

export class UpdateReporteDto extends PartialType(CreateReporteDto) {
  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsNumber()
  @IsOptional()
  latitud?: number;

  @IsNumber()
  @IsOptional()
  longitud?: number;

  @IsString()
  @IsOptional()
  @IsIn(['pendiente', 'en_proceso', 'resuelto', 'rechazado']) // ✅ Ahora funciona
  estado?: string;

  @IsNumber()
  @IsOptional()
  animal_id?: number;

  // ❌ NO incluir imagen_url aquí - se maneja separadamente con el archivo
}
