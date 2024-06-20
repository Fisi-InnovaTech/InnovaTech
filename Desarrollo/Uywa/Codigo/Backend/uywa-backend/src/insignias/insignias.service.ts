import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

const insigniasMap = {
    '1': 'Bienvenido',
    '2': 'Primeros pasos',
    '3': 'Amante de los animales',
    '4': 'Guardian de la naturaleza',
    '5': 'Protector de la bioesfera',
  };  

@Injectable()
export class InsigniasService {

    constructor(private prisma: PrismaService) {}

    // Las insignias devuelven un string que contiene nums
    // Del 1 al 5: Cada número representa una insignia
    // 1: Bienvenido
    // 2: Primeros pasos (primer reporte aceptado
    // 3: Amante de los animales (10 reportes aceptados)
    // 4: Guardian de la naturaleza (25 reportes aceptados)
    // 5: Protector de la bioesfera (50 reportes aceptados)
    
    async getInsignias(id: number) {
        const numsString = await this.prisma.usuario.findUnique({
            where: { id: Number(id) },
            select: { insignia: true }
        });
        
        const numsArray = numsString.insignia.split('');
        const insigniasArray = numsArray.map(num => insigniasMap[num]);
        return insigniasArray;
    }


    // Comportamiento:

    async updateInsignia(id: number) {
        // Se obtiene la insignia actual del usuario de la db
        const response = await this.prisma.usuario.findUnique({
            where: { id: Number(id) },
            select: { insignia: true }
        });

        // Se obtiene el Numero de reportes donde el user_id dependerá del id que se le pase
        const reportes = await this.prisma.reporte.count({
            where: { user_id: Number(id), estado: 'aprobado'}
        }); 

        let insignia = response.insignia; // Comienza en 1 si está registrado el usuario

        // Se va añadiendo al string de la insignia dependiendo de la cantidad de reportes que tenga

        // Igualmente, se debe hacer una verificacion del string  
        // Por ejemplo, el usuario ya tiene el numero 5 de la insignia y aún el usuario tiene 50 reportes, no se debe de agregar más. 
        // Por lo tanto, se hace otra verificacion para que no se añada más de una vez la misma insignia
        if (reportes >= 50) {
            if (!insignia.includes('5')) {
                insignia += '5';
            }
        } 
        if (reportes >= 25) {
            if (!insignia.includes('4')) {
                insignia += '4';
            }
        } 
        if (reportes >= 10) {
            if (!insignia.includes('3')) {
                insignia += '3';
            }
        } 
        if (reportes >= 1) {
            if (!insignia.includes('2')) {
                insignia += '2';
            }
        }
        await this.prisma.usuario.update({
            where: { id: Number(id) },
            data: { insignia: insignia }
        });
        return insignia;
    }
}
