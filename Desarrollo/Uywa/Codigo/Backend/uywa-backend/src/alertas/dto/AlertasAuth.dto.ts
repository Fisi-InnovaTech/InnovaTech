import { IsNotEmpty, IsOptional, IsString } from "class-validator";   

export class AlertasAuthDto {
    @IsOptional() // Cambio para que permita la subida
    @IsString()
    evidencia_imagen: string;
    @IsNotEmpty()
    @IsString()
    animal_nombre: string
    @IsNotEmpty()
    @IsString()
    descripcion: string;
    
    @IsNotEmpty()
    latitud: number;
  
    @IsNotEmpty()
    longitud: number;

    @IsString()
    nombre_reportante: string;
    @IsString()
    estado: string;

    @IsNotEmpty()
    user_id: number;
    //usuario: usuario;
}