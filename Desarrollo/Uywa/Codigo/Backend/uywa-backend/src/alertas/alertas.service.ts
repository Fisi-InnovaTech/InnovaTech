import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AlertaFechaLugarDto } from './dto/AlertaFechaLugar.dto';
import { reporte } from '@prisma/client';
import { AlertasAuthDto } from './dto/AlertasAuth.dto';


@Injectable()
export class AlertasService {
    prisma: any;

    constructor(private prismaService: PrismaService) {
        
    }
    
    async getAlertaByFechaAndDireccion(alerta : AlertaFechaLugarDto) : Promise<reporte>{
        const {fecha, latitud, longitud} = alerta;
        const result = await this.prismaService.reporte.findFirst({
            where: {
                fecha_creacion: fecha,
                latitud: parseFloat(latitud),
                longitud: parseFloat(longitud)
            }
        });

        if (!result) throw new HttpException('Alerta no encontrada.', HttpStatus.NOT_FOUND);

        return result;
    }


    async getLocations(){
        return this.prismaService.reporte.findMany({
            select:{
                descripcion: true,
                longitud: true,
                latitud: true,
                evidencia_imagen: true,
                
            }
        });
    }


    async getBasic(){
        return this.prismaService.reporte.findMany({
            select:{
                descripcion: true,
                nombre_reportante: true,
                evidencia_imagen: true,
            }
        });
    }

    async createAlerta(alerta: AlertasAuthDto)  {
        return await this.prismaService.reporte.create({
            data: {
                user_id: alerta.userId,
                animal_nombre: alerta.animal_nombre,
                nombre_reportante: alerta.nombre_reportante,
                latitud: alerta.latitud,
                longitud: alerta.longitud,
                descripcion: alerta.descripcion,
                estado: alerta.estado
            }
        });
    }
}