import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AlertasAuthDto } from './dto/AlertasAuth.dto'; 
//Funciones de la base de datos

@Injectable()
export class AlertasService {
    constructor (private prisma: PrismaService){}


    async registerAlerta(alerta:AlertasAuthDto) {
        try{
            return await this.prisma.reporte.create({
                data:{
                    evidencia_imagen: alerta.evidencia_imagen,
                    animal_nombre: alerta.animal_nombre,
                    descripcion: alerta.descripcion,
                    latitud: alerta.latitud,
                    longitud: alerta.longitud,
                    nombre_reportante: alerta.nombre_reportante, 
                    fecha_creacion: alerta.fecha_creacion,   
                    estado: alerta.estado,
                    usuario: { connect: { id: alerta.usuario.id } }
                }
            });
        } catch (error) {
            throw new BadRequestException('Error al registrar la alerta');
        }
    
    }


    getAlertas(): String[] {
        return ['Alerta 1', 'Alerta 2', 'Alerta 3'];
    }
}