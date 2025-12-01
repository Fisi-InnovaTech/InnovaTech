// src/eventos/dto/create-evento.dto.ts
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEventoDto {
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @IsString()
  @IsNotEmpty()
  descripcion: string;

  // Fecha del evento (no la fecha de creación del registro)
  @IsDateString()
  @IsNotEmpty()
  fecha: string; // la convertimos a Date en el service

  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  usuarioId: number; // mapea a user_id en Prisma

  @IsString()
  @IsOptional()
  imagen_url?: string;

  @IsString()
  @IsOptional()
  categoria?: string;

  @IsString()
  @IsOptional()
  lugar?: string;

  // Opcional: si quieres poder setear manualmente la fecha de creación
  @IsDateString()
  @IsOptional()
  fecha_creacion?: string;
}
