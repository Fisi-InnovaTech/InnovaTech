import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { AlertasAuthDto, } from './dto/AlertasAuth.dto';
import { AlertaFechaLugarDto } from './dto/AlertaFechaLugar.dto';

const prisma = new PrismaClient();

@Injectable()
export class AlertasService {
    constructor (private prisma: PrismaClient){}

    
    async getAlertaByFechaAndDireccion(alerta : AlertaFechaLugarDto){
      const {fecha, latitud, longitud} = alerta;
      const result = await this.prisma.reporte.findFirst({
          where: {
              fecha_creacion: fecha,
              latitud: parseFloat(latitud),
              longitud: parseFloat(longitud)
          }
      });

      if (!result) throw new BadRequestException('Alerta no encontrada.');

      return result;
    }

    async getLocations() {
      return this.prisma.reporte.findMany({
        select: {
          descripcion: true,
          longitud: true,
          latitud: true,
          evidencia_imagen: true,
        },
      });
    }

    async getBasic(){
      return this.prisma.reporte.findMany({
          select:{
              descripcion: true,
              nombre_reportante: true,
              evidencia_imagen: true,
          }
      });
  }

    async createAlerta(alerta:AlertasAuthDto) {

        try{
            const fecha: Date = new Date(alerta.fecha_creacion);

            return await this.prisma.reporte.create({
                data:{
                    evidencia_imagen: alerta.evidencia_imagen,
                    animal_nombre: alerta.animal_nombre,
                    descripcion: alerta.descripcion,
                    latitud: alerta.latitud,
                    longitud: alerta.longitud,
                    nombre_reportante: alerta.nombre_reportante, 
                    fecha_creacion:  fecha as Date,   
                    estado: alerta.estado,
                    usuario: { connect: { id: alerta.usuario.id } }
                }
            });
        } catch (error) {
            console.error(error);
            throw new BadRequestException('Error al registrar la alerta');
        }
    
    }


}
