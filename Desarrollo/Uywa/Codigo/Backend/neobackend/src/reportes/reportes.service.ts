import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReporteDto } from './dto/create-reporte.dto';
import { UpdateReporteDto } from './dto/update-reporte.dto';

@Injectable()
export class ReportesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createReporteDto: CreateReporteDto) {
    try {
      // Verificar que el usuario existe
      const usuarioExists = await this.prisma.usuario.findUnique({
        where: { id: createReporteDto.usuarioId },
      });

      if (!usuarioExists) {
        throw new BadRequestException(`Usuario con ID ${createReporteDto.usuarioId} no existe`);
      }

      const reporte = await this.prisma.reporte.create({
        data: {
          titulo: createReporteDto.titulo,
          descripcion: createReporteDto.descripcion,
          latitud: createReporteDto.latitud,
          longitud: createReporteDto.longitud,
          estado: createReporteDto.estado || 'pendiente',
          evidencia_imagen: createReporteDto.evidencia_imagen,
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
      throw new BadRequestException(`Estado inválido. Debe ser uno de: ${estadosValidos.join(', ')}`);
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

  async update(id: number, updateReporteDto: UpdateReporteDto) {
    // Verificar que el reporte existe
    const reporteExists = await this.prisma.reporte.findUnique({
      where: { id },
    });

    if (!reporteExists) {
      throw new NotFoundException(`Reporte con ID ${id} no encontrado`);
    }

    try {
      const reporteActualizado = await this.prisma.reporte.update({
        where: { id },
        data: updateReporteDto,
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
      throw new BadRequestException('Error al eliminar el reporte');
    }
  }
}