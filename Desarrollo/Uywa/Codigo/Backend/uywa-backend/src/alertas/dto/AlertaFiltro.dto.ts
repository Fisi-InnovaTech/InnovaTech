import { IsNotEmpty, IsNumber, IsOptional, IsString, isNumber } from "class-validator";

export class AlertaFiltroDto {
    @IsOptional()
    @IsString()
    fecha_ini?: string;
    @IsOptional()
    @IsString()
    fecha_fin?: string;
    @IsOptional()
    @IsString()
    animal?: string;
    @IsOptional()
    @IsString() 
    region?: string;
}