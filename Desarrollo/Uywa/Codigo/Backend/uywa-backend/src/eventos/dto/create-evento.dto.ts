import { IsNotEmpty, IsNumber, IsString, IsDate} from "class-validator";   
import { Type } from 'class-transformer';

export class CreateEventoDto {
    @IsNotEmpty()
    @IsNumber()
    readonly mod_id: number;
    @IsNotEmpty()
    @IsString()
    readonly nombre: string;
    @IsNotEmpty()
    @IsString()
    readonly descripcion: string;
    @IsNotEmpty()
    @Type(() => Buffer)
    readonly imagen: Buffer;
    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)    
    readonly fecha: Date;
    @IsNotEmpty()
    @IsString()
    readonly ubicacion: string;
    @IsNotEmpty()
    @IsString()
    readonly categoria: string;
}
