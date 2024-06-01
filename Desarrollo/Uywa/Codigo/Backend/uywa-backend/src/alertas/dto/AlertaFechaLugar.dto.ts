import { IsString, IsNotEmpty } from "class-validator";

export class AlertaFechaLugarDto {
    @IsString()
    @IsNotEmpty()
    fecha: string;

    @IsNotEmpty()
    latitud: string;

    @IsNotEmpty()
    longitud: string;
}