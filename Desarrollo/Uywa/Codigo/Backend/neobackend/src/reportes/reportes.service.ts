import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateReporteDto } from './dto/create-reporte.dto';
import { UpdateReporteDto } from './dto/update-reporte.dto';

@Injectable()
export class ReportesService {
  constructor(private readonly prisma: PrismaService) { }

  /**
   * Crea un reporte con soporte para archivo subido (evidencia_imagen)
   */
  async create(createReporteDto: CreateReporteDto, file?: Express.Multer.File) {
    try {
      // 1. Verificar que el usuario existe
      const usuarioExists = await this.prisma.usuario.findUnique({
        where: { id: createReporteDto.usuarioId },
      });

      if (!usuarioExists) {
        throw new BadRequestException(
          `Usuario con ID ${createReporteDto.usuarioId} no existe`,
        );
      }

      // 2. Construir la URL de la imagen (si hay archivo)
      let evidenciaImagen: string | undefined = undefined;

      if (file) {
        // Puedes mover esto a config/env
        const baseUrl =
          process.env.APP_BASE_URL || 'https://innovatech-ztzv.onrender.com';

        // Normalizar path (por si viene con backslashes en Windows)
        const normalizedPath = file.path.replace(/\\/g, '/');
        const imagePath = normalizedPath.startsWith('/')
          ? normalizedPath
          : `/${normalizedPath}`;

        evidenciaImagen = `${baseUrl}${imagePath}`;
      } else if (createReporteDto.evidencia_imagen) {
        // Si no se subió archivo pero llega un path/URL desde el body
        evidenciaImagen = createReporteDto.evidencia_imagen;
      }

      // 3. Crear el reporte
      const reporte = await this.prisma.reporte.create({
        data: {
          titulo: createReporteDto.titulo,
          descripcion: createReporteDto.descripcion,
          latitud: createReporteDto.latitud,
          longitud: createReporteDto.longitud,
          estado: createReporteDto.estado || 'pendiente',
          evidencia_imagen: evidenciaImagen,
          animal_nombre: createReporteDto.animal_nombre,
          animal_especie: createReporteDto.animal_especie,
          usuarioId: createReporteDto.usuarioId,
        },
        include: {
          usuario: {
            select: {
              id: true,
              nombres: true,
              apellidos: true,
              email: true,
            },
          },
        },
      });

      return {
        message: 'Reporte creado exitosamente',
        data: reporte,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error('Error al crear reporte:', error);
      throw new BadRequestException('Error al crear el reporte');
    }
  }

  async findAll() {
    const reportes = await this.prisma.reporte.findMany({
      include: {
        usuario: {
          select: {
            id: true,
            nombres: true,
            apellidos: true,
            email: true,
          },
        },
      },
      orderBy: {
        fecha_creacion: 'desc',
      },
    });

    return {
      message: 'Reportes obtenidos exitosamente',
      data: reportes,
      total: reportes.length,
    };
  }

  async findOne(id: number) {
    const reporte = await this.prisma.reporte.findUnique({
      where: { id },
      include: {
        usuario: {
          select: {
            id: true,
            nombres: true,
            apellidos: true,
            email: true,
            dni: true,
          },
        },
      },
    });

    if (!reporte) {
      throw new NotFoundException(`Reporte con ID ${id} no encontrado`);
    }

    return {
      message: 'Reporte obtenido exitosamente',
      data: reporte,
    };
  }

  async findByUsuario(usuarioId: number) {
    // Verificar que el usuario existe
    const usuarioExists = await this.prisma.usuario.findUnique({
      where: { id: usuarioId },
    });

    if (!usuarioExists) {
      throw new NotFoundException(`Usuario con ID ${usuarioId} no encontrado`);
    }

    const reportes = await this.prisma.reporte.findMany({
      where: { usuarioId },
      include: {
        usuario: {
          select: {
            id: true,
            nombres: true,
            apellidos: true,
            email: true,
          },
        },
      },
      orderBy: {
        fecha_creacion: 'desc',
      },
    });

    return {
      message: 'Reportes del usuario obtenidos exitosamente',
      data: reportes,
      total: reportes.length,
    };
  }

  async findByEstado(estado: string) {
    const estadosValidos = ['pendiente', 'en_proceso', 'resuelto', 'rechazado'];

    if (!estadosValidos.includes(estado)) {
      throw new BadRequestException(
        `Estado inválido. Debe ser uno de: ${estadosValidos.join(', ')}`,
      );
    }

    const reportes = await this.prisma.reporte.findMany({
      where: { estado },
      include: {
        usuario: {
          select: {
            id: true,
            nombres: true,
            apellidos: true,
            email: true,
          },
        },
      },
      orderBy: {
        fecha_creacion: 'desc',
      },
    });

    return {
      message: `Reportes con estado '${estado}' obtenidos exitosamente`,
      data: reportes,
      total: reportes.length,
    };
  }

  async update(
    id: number,
    updateReporteDto: UpdateReporteDto,
    file?: Express.Multer.File,
  ) {
    // Verificar que el reporte existe
    const reporteExists = await this.prisma.reporte.findUnique({
      where: { id },
    });

    if (!reporteExists) {
      throw new NotFoundException(`Reporte con ID ${id} no encontrado`);
    }

    // Partimos de la evidencia actual de BD
    let evidenciaImagen: string | null = reporteExists.evidencia_imagen;

    // 1) Si viene string en el DTO, la usamos (ej: URL manual)
    if (typeof updateReporteDto.evidencia_imagen === 'string') {
      evidenciaImagen = updateReporteDto.evidencia_imagen;
    }

    // 2) Si viene archivo nuevo, generamos nueva URL
    if (file) {
      const baseUrl =
        process.env.APP_BASE_URL || 'https://innovatech-ztzv.onrender.com';

      const normalizedPath = file.path.replace(/\\/g, '/');
      const imagePath = normalizedPath.startsWith('/')
        ? normalizedPath
        : `/${normalizedPath}`;

      evidenciaImagen = `${baseUrl}${imagePath}`;
    }

    try {
      const reporteActualizado = await this.prisma.reporte.update({
        where: { id },
        data: {
          ...updateReporteDto,
          evidencia_imagen: evidenciaImagen,
        },
        include: {
          usuario: {
            select: {
              id: true,
              nombres: true,
              apellidos: true,
              email: true,
            },
          },
        },
      });

      return {
        message: 'Reporte actualizado exitosamente',
        data: reporteActualizado,
      };
    } catch (error) {
      console.error('Error al actualizar reporte:', error);
      throw new BadRequestException('Error al actualizar el reporte');
    }
  }

  async remove(id: number) {
    // Verificar que el reporte existe
    const reporteExists = await this.prisma.reporte.findUnique({
      where: { id },
    });

    if (!reporteExists) {
      throw new NotFoundException(`Reporte con ID ${id} no encontrado`);
    }

    try {
      await this.prisma.reporte.delete({
        where: { id },
      });

      return {
        message: 'Reporte eliminado exitosamente',
        data: { id },
      };
    } catch (error) {
      console.error('Error al eliminar reporte:', error);
      throw new BadRequestException('Error al eliminar el reporte');
    }
  }
}
