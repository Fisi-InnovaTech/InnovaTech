import { IsNotEmpty, IsNumber, IsString, IsDate } from "class-validator";   
import { usuario } from ".prisma/client";

export class AlertasAuthDto {
    @IsNotEmpty()
    @IsString()
    evidencia_imagen: string;
    @IsNotEmpty()
    @IsString()
    animal_nombre: string
    @IsNotEmpty()
    @IsString()
    descripcion: string;
    @IsNotEmpty()
    @IsNumber()
    latitud: number;
    @IsNotEmpty()
    @IsNumber() 
    longitud: number;
    @IsString()
    nombre_reportante: string;
    @IsDate()
    fecha_creacion: Date;   // Debe autogenerarse en la 
                            // Base de datos @defaul(now())
    @IsString()
    estado: string;
    usuario: usuario;
}