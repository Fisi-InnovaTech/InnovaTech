import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsIn,
} from 'class-validator';

export class CreateReporteDto {
  @IsString()
  @IsNotEmpty()
  titulo: string;

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
  evidencia_imagen?: string;

  @IsString()
  @IsNotEmpty()
  animal_nombre: string;

  @IsString()
  @IsOptional()
  animal_especie?: string;
}
