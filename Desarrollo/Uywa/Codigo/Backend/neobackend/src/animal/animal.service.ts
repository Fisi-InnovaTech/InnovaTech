import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { UpdateAnimalDto } from './dto/update-animal.dto';
import { S3Service } from 'src/aws/s3.service';
import * as fs from 'fs';

@Injectable()
export class AnimalService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly s3Service: S3Service,
  ) {}

  async create(createAnimalDto: CreateAnimalDto, file?: Express.Multer.File) {
    try {
      const nombreNormalizado = createAnimalDto.nombre.trim().toLowerCase();

      // Verificar si el animal ya existe
      const animalExistente = await this.prisma.animal.findFirst({
        where: {
          nombre: {
            equals: nombreNormalizado,
            mode: 'insensitive',
          },
        },
      });

      if (animalExistente) {
        throw new BadRequestException(
          `El animal con nombre '${createAnimalDto.nombre}' ya existe.`,
        );
      }

      // 🔴 Mismo patrón que en reportes: manejar imagen
      let imagen_url: string | undefined = undefined;

      if (file) {
        // Subir a S3 desde el archivo temporal
        imagen_url = await this.s3Service.uploadFile(file, 'animales');

        // Limpiar archivo temporal
        if (file.path && fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      } else if (createAnimalDto.imagen_url) {
        // Usar URL manual si no hay archivo (igual que en reportes)
        imagen_url = createAnimalDto.imagen_url;
      } else {
        // 🔴 Igual que en reportes: requerir imagen
        throw new BadRequestException('Se requiere una imagen para el animal');
      }

      // Crear animal con la URL de la imagen
      const animal = await this.prisma.animal.create({
        data: {
          nombre: createAnimalDto.nombre,
          descripcion: createAnimalDto.descripcion,
          habitad: createAnimalDto.habitad,
          estado: createAnimalDto.estado,
          imagen_url,
          video_url: null, // Como solicitaste, siempre null
        },
      });

      return { message: 'Animal creado correctamente', data: animal };
    } catch (error) {
      // Limpiar archivo temporal en caso de error
      if (file?.path && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }

      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error('Error al crear animal:', error);
      throw new BadRequestException('Error al crear el animal');
    }
  }

  async findAll() {
    const animales = await this.prisma.animal.findMany();
    return { message: 'Animales encontrados correctamente', data: animales };
  }

  async listAll() {
    const animales = await this.prisma.animal.findMany({
      select: {
        id: true,
        nombre: true,
      },
    });
    return { message: 'Animales encontrados correctamente', data: animales };
  }

  async findOne(id: number) {
    const animal = await this.prisma.animal.findUnique({ where: { id } });
    if (!animal)
      throw new NotFoundException(`Animal con ID ${id} no encontrado`);
    return { message: 'Animal encontrado correctamente', data: animal };
  }

  async update(
    id: number,
    updateAnimalDto: UpdateAnimalDto,
    file?: Express.Multer.File,
  ) {
    try {
      // Obtener el animal actual
      const animalActual = await this.prisma.animal.findUnique({
        where: { id },
      });
      if (!animalActual) {
        throw new NotFoundException(`Animal con ID ${id} no encontrado`);
      }

      const data: any = {
        nombre: updateAnimalDto.nombre,
        descripcion: updateAnimalDto.descripcion,
        habitad: updateAnimalDto.habitad,
        estado: updateAnimalDto.estado,
        // video_url siempre null como solicitaste
      };

      // 🔴 Mismo patrón que en reportes: manejar imagen
      if (file) {
        // Subir nueva imagen a S3
        const nuevaImagenUrl = await this.s3Service.uploadFile(
          file,
          'animales',
        );
        data.imagen_url = nuevaImagenUrl;

        // Eliminar la imagen anterior de S3 si es una URL de S3
        if (this.s3Service.isS3Url(animalActual.imagen_url)) {
          await this.s3Service.deleteFile(animalActual.imagen_url);
        }

        // Limpiar archivo temporal
        if (file.path && fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      } else if (updateAnimalDto.imagen_url) {
        // Usar URL manual si no hay archivo
        data.imagen_url = updateAnimalDto.imagen_url;

        // Eliminar la imagen anterior de S3 si es una URL de S3
        if (this.s3Service.isS3Url(animalActual.imagen_url)) {
          await this.s3Service.deleteFile(animalActual.imagen_url);
        }
      }
      // Si no se envía imagen, se mantiene la actual

      // Actualizar animal
      const animal = await this.prisma.animal.update({
        where: { id },
        data,
      });

      return { message: 'Animal actualizado correctamente', data: animal };
    } catch (error) {
      // Limpiar archivo temporal en caso de error
      if (file?.path && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }

      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      console.error('Error al actualizar animal:', error);
      throw new BadRequestException('Error al actualizar el animal');
    }
  }

  async remove(id: number) {
    try {
      // Verificar si el animal existe
      const animal = await this.prisma.animal.findUnique({
        where: { id },
        include: {
          Reporte: {
            include: {
              evidencia: true,
            },
          },
        },
      });

      if (!animal) {
        throw new NotFoundException(`Animal con ID ${id} no encontrado`);
      }

      // 🔴 PASO 1: Eliminar evidencias de S3 y de la base de datos
      for (const reporte of animal.Reporte) {
        if (reporte.evidencia) {
          // Eliminar imagen de S3 de la evidencia
          if (this.s3Service.isS3Url(reporte.evidencia.imagen_url)) {
            await this.s3Service.deleteFile(reporte.evidencia.imagen_url);
          }

          // Eliminar la evidencia
          await this.prisma.evidencia.delete({
            where: { id: reporte.evidencia_id },
          });
        }
      }

      // 🔴 PASO 2: Eliminar reportes
      await this.prisma.reporte.deleteMany({
        where: { animal_id: id },
      });

      // 🔴 PASO 3: Eliminar imagen del animal de S3
      if (this.s3Service.isS3Url(animal.imagen_url)) {
        await this.s3Service.deleteFile(animal.imagen_url);
      }

      // 🔴 PASO 4: Eliminar el animal
      await this.prisma.animal.delete({
        where: { id },
      });

      return {
        message: 'Animal eliminado correctamente con eliminación en cascada',
        detalles: {
          animalEliminado: animal.nombre,
          reportesEliminados: animal.Reporte.length,
          evidenciasEliminadas: animal.Reporte.filter((r) => r.evidencia)
            .length,
        },
      };
    } catch (error) {
      console.error('Error al eliminar animal con cascada:', error);

      if (error instanceof NotFoundException) {
        throw error;
      }

      if (error.code === 'P2003') {
        throw new BadRequestException(
          'No se puede eliminar el animal debido a restricciones de clave foránea. ' +
            'Contacta al administrador del sistema.',
        );
      }

      throw new BadRequestException(
        'Error al eliminar el animal con sus dependencias',
      );
    }
  }
}
