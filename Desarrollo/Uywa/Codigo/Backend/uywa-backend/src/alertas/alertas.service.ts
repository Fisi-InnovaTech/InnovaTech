import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { AlertasAuthDto, } from './dto/AlertasAuth.dto';
import { AlertaFiltroDto } from './dto/AlertaFiltro.dto';
import axios from 'axios';

@Injectable()
export class AlertasService {
    constructor (private prisma: PrismaClient){}
    
    async obtenerRegion(latitud, longitud) {
        const googleMapsApiKey = 'AIzaSyBZWT4UW-431B4nv7eJRhjBY9ecJcoYb0M';
        const departamentosPeru = [
            "Amazonas", "Áncash", "Apurímac", "Arequipa", "Ayacucho",
            "Cajamarca", "Callao", "Cusco", "Huancavelica", "Huánuco",
            "Ica", "Junín", "La Libertad", "Lambayeque", "Lima",
            "Loreto", "Madre de Dios", "Moquegua", "Pasco", "Piura",
            "Puno", "San Martín", "Tacna", "Tumbes", "Ucayali"
        ];

        try {
            const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
                params: {
                    latlng: `${latitud},${longitud}`,
                    key: googleMapsApiKey
                }
            });
            const results = response.data.results;
            if (results.length > 0) {
                const addressComponents = results[0].address_components;
                const regionComponent = addressComponents.find(
                    component => component.types.includes('administrative_area_level_1')
            );
                return regionComponent ? regionComponent.long_name : null;
            } else {
                throw new Error('No se pudo determinar la región.');
            }
        } catch (error) {
            console.error('Error al obtener la región:', error);
            return null;
        }
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
    
    async getLocations() {
        const result = await this.prisma.reporte.findMany({
            where: {
                estado: 'aprobado',
            },
            select: {
                id: true,
                animal_nombre: true,
                evidencia_imagen: true,
                descripcion: true,
                latitud: true,
                longitud: true,
            },
        });
        if (!result) throw new BadRequestException('No hay alertas registradas.');
        return result;
    }

    async getAlertaByFilter(alertaFiltro : AlertaFiltroDto){
        const { fecha_ini, fecha_fin, animal, region } = alertaFiltro;
    
        const condiciones: any = {estado: 'aprobado'};
    
        if (fecha_ini && fecha_fin) {
          condiciones.fecha_creacion = {
            gte: new Date(fecha_ini),
            lte: new Date(fecha_fin)
          };
        } else if (fecha_ini) {
          condiciones.fecha_creacion = {
            gte: new Date(fecha_ini)
          };
        } else if (fecha_fin) {
          condiciones.fecha_creacion = {
            lte: new Date(fecha_fin)
          };
        }
        
        if (animal) {
          condiciones.animal_nombre = animal;
        }

        const reportes = await this.prisma.reporte.findMany({
            where: condiciones,
            select: {
              id: true,
              animal_nombre: true,
              evidencia_imagen: true,
              descripcion: true,
              latitud: true,
              longitud: true,
              fecha_creacion: true
            }
        });
    
        if (region) {
            const reportesFiltradosPorRegion = [];
            for (let reporte of reportes) {
                const reporteRegion = await this.obtenerRegion(reporte.latitud, reporte.longitud);
                if (reporteRegion === region) {
                    reportesFiltradosPorRegion.push(reporte);
                }
            }
            return reportesFiltradosPorRegion;
        } else {
            return reportes;
        }
    }
}
