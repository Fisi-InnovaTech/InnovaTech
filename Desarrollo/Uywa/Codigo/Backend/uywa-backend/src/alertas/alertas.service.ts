import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AlertaFechaLugarDto } from './dto/AlertaFechaLugar.dto';
import { reporte } from '@prisma/client';

@Injectable()
export class AlertasService {

    constructor(private prismaService: PrismaService) {
        
    }

    getAlertas(): String[] {
        return ['Alerta 1', 'Alerta 2', 'Alerta 3'];
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


    // De Prueba. Luego borrar.
    async createAlerta(alerta: reporte): Promise<reporte> {
        return await this.prismaService.reporte.create({
            data: {
                user_id: alerta.user_id,
                animal_nombre: alerta.animal_nombre,
                nombre_reportante: alerta.nombre_reportante,
                fecha_creacion: alerta.fecha_creacion,
                latitud: alerta.latitud,
                longitud: alerta.longitud,
                descripcion: alerta.descripcion,
                estado: alerta.estado
            }
        });
        // Json de prueba:
        /*
        {
            "user_id": 1,
            "animal_nombre": "Perro",
            "nombre_reportante": "Juan",
            "fecha_creacion": "2021-10-10T14:48:00.000Z",
            "latitud": 1,
            "longitud": 2,
            "descripcion": "Perro perdido",
            "estado": "Encontrado"
        },
        {
            "user_id": 2,
            "animal_nombre": "Gato",
            "nombre_reportante": "Pedro",
            "fecha_creacion": "2021-10-10T14:48:00.000Z",
            "latitud": 4,
            "longitud": 6,
            "descripcion": "Gato perdido",
            "estado": "Encontrado"
        }
        */
    }
}
