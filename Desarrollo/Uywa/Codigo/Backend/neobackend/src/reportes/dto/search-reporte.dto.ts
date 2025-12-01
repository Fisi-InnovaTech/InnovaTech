import { IsOptional, IsString, IsNumberString } from 'class-validator';

export class SearchReporteDto {
  @IsOptional()
  @IsString()
  fecha_ini?: string;

  @IsOptional()
  @IsString()
  fecha_fin?: string;

  @IsOptional()
  @IsNumberString()
  animal_id?: string;

  @IsOptional()
  @IsString()
  departamento_id?: string;
}
