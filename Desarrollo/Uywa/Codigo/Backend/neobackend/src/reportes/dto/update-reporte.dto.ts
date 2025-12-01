import { PartialType } from '@nestjs/mapped-types';
import { CreateReporteDto } from './create-reporte.dto';
import { IsString, IsNumber, IsOptional, IsIn } from 'class-validator';

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
  @IsIn(['pendiente', 'en_proceso', 'resuelto', 'rechazado'])
  estado?: string;

  @IsString()
  @IsOptional()
  imagen_url?: string;

  @IsNumber()
  @IsOptional()
  animal_id?: number;
}
