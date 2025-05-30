import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";


export class ModeratorRegisterAuthDto {
    @IsString()
    @IsNotEmpty()
    nombre: string;

    @IsString()
    @IsNotEmpty()
    apellidos: string;

    @IsEmail()
    @IsNotEmpty()
    correo: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
    @MinLength(5)
    password: string;

}