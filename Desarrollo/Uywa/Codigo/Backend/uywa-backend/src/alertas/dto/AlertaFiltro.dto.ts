import {IsString } from "class-validator";

export class AlertaFiltroDto {
    @IsString()
    fecha_ini: string;
    @IsString()
    fecha_fin: string;
    @IsString()
    animal: string;
    @IsString() 
    region: string;
}