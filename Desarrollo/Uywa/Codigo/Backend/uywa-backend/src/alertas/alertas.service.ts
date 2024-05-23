import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { AlertasAuthDto } from './dto/AlertasAuth.dto';

const prisma = new PrismaClient();

@Injectable()
export class AlertasService {
    constructor (private prisma: PrismaClient){}

    async getAlertas() {
        const usuarioYReportes = await prisma.usuario.findMany({
          select: {
            id: true,
            nombre: true,
            reporte: {
              select: {
                animal_nombre: true,
                estado: true
              }
            }
          }
        })

        return usuarioYReportes;
    }

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

}
