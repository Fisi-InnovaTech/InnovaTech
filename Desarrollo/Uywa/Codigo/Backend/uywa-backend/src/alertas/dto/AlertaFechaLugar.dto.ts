import { IsDate, IsString, IsNotEmpty } from "class-validator";

export class AlertaFechaLugarDto {
    @IsDate()
    @IsNotEmpty()
    fecha: string;

    @IsNotEmpty()
    latitud: string;

    @IsNotEmpty()
    longitud: string;
}