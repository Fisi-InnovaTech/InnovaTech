// src/eventos/eventos.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEventoDto } from './dto/create-evento.dto';
import { UpdateEventoDto } from './dto/update-evento.dto';
import { S3Service } from 'src/aws/s3.service';

@Injectable()
export class EventosService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly s3Service: S3Service,
  ) {}

  /**
   * Crear evento con soporte para imagen (S3 o URL manual)
   */
  async create(createEventoDto: CreateEventoDto, file?: Express.Multer.File) {
    try {
      // 1. Validar y castear usuarioId
      const usuarioId = Number(createEventoDto.usuarioId);
      if (Number.isNaN(usuarioId)) {
        throw new BadRequestException('usuarioId debe ser un número');
      }

      // 2. Verificar que el usuario existe
      const usuarioExists = await this.prisma.usuario.findUnique({
        where: { id: usuarioId },
      });

      if (!usuarioExists) {
        throw new BadRequestException(`Usuario con ID ${usuarioId} no existe`);
      }

      // 3. Parsear fecha del evento
      if (!createEventoDto.fecha) {
        throw new BadRequestException('fecha es obligatoria');
      }

      const fecha = new Date(createEventoDto.fecha);
      if (Number.isNaN(fecha.getTime())) {
        throw new BadRequestException(
          'fecha debe ser una fecha válida (ISO string)',
        );
      }

      // 4. fecha_creacion opcional
      let fecha_creacion: Date | undefined = undefined;
      if (createEventoDto.fecha_creacion) {
        const parsed = new Date(createEventoDto.fecha_creacion);
        if (Number.isNaN(parsed.getTime())) {
          throw new BadRequestException(
            'fecha_creacion debe ser una fecha válida (ISO string)',
          );
        }
        fecha_creacion = parsed;
      }

      // 5. Manejo de imagen
      let imagen_url: string | undefined = undefined;

      if (file) {
        // Subir a S3 (carpeta "eventos")
        imagen_url = await this.s3Service.uploadFile(file, 'eventos');
      } else if (createEventoDto.imagen_url) {
        imagen_url = createEventoDto.imagen_url;
      }
      console.log('Imagen URL:', imagen_url);
      // 6. Crear evento
      const evento = await this.prisma.evento.create({
        data: {
          titulo: createEventoDto.titulo,
          descripcion: createEventoDto.descripcion,
          fecha,
          imagen_url,
          user_id: usuarioId,
          categoria: createEventoDto.categoria || null,
          lugar: createEventoDto.lugar || null,
          ...(fecha_creacion && { fecha_creacion }),
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
        message: 'Evento creado exitosamente',
        data: evento,
      };
    } catch (error) {
      console.error('Error al crear evento:', error);
      console.log(error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error('Error al crear evento:', error);
      throw new BadRequestException('Error al crear el evento');
    }
  }

  /**
   * Listar todos los eventos
   */
  async findAll() {
    const eventos = await this.prisma.evento.findMany({
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
        fecha: 'asc',
      },
    });

    return {
      message: 'Eventos obtenidos exitosamente',
      data: eventos,
      total: eventos.length,
    };
  }

  /**
   * Obtener un evento por ID
   */
  async findOne(id: number) {
    const evento = await this.prisma.evento.findUnique({
      where: { id },
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

    if (!evento) {
      throw new NotFoundException(`Evento con ID ${id} no encontrado`);
    }

    return {
      message: 'Evento obtenido exitosamente',
      data: evento,
    };
  }

  /**
   * Obtener eventos por usuario
   */
  async findByUsuario(usuarioId: number) {
    const usuarioExists = await this.prisma.usuario.findUnique({
      where: { id: usuarioId },
    });

    if (!usuarioExists) {
      throw new NotFoundException(`Usuario con ID ${usuarioId} no encontrado`);
    }

    const eventos = await this.prisma.evento.findMany({
      where: { user_id: usuarioId },
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
        fecha: 'asc',
      },
    });

    return {
      message: 'Eventos del usuario obtenidos exitosamente',
      data: eventos,
      total: eventos.length,
    };
  }

  /**
   * Actualizar evento (con posibilidad de cambiar la imagen)
   */
  async update(
    id: number,
    updateEventoDto: UpdateEventoDto,
    file?: Express.Multer.File,
  ) {
    const eventoExists = await this.prisma.evento.findUnique({
      where: { id },
    });

    if (!eventoExists) {
      throw new NotFoundException(`Evento con ID ${id} no encontrado`);
    }

    const data: any = {};

    if (updateEventoDto.titulo) {
      data.titulo = updateEventoDto.titulo;
    }

    if (updateEventoDto.descripcion) {
      data.descripcion = updateEventoDto.descripcion;
    }

    if (updateEventoDto.categoria !== undefined) {
      data.categoria = updateEventoDto.categoria;
    }

    if (updateEventoDto.lugar !== undefined) {
      data.lugar = updateEventoDto.lugar;
    }

    // Actualizar fecha del evento si llega
    if (updateEventoDto.fecha) {
      const fecha = new Date(updateEventoDto.fecha);
      if (Number.isNaN(fecha.getTime())) {
        throw new BadRequestException(
          'fecha debe ser una fecha válida (ISO string)',
        );
      }
      data.fecha = fecha;
    }

    // Actualizar fecha_creacion si llega (opcional)
    if (updateEventoDto.fecha_creacion) {
      const fechaCreacion = new Date(updateEventoDto.fecha_creacion);
      if (Number.isNaN(fechaCreacion.getTime())) {
        throw new BadRequestException(
          'fecha_creacion debe ser una fecha válida (ISO string)',
        );
      }
      data.fecha_creacion = fechaCreacion;
    }

    // Actualizar usuario si llega
    if (
      updateEventoDto.usuarioId !== undefined &&
      updateEventoDto.usuarioId !== null
    ) {
      const usuarioId = Number(updateEventoDto.usuarioId);
      if (Number.isNaN(usuarioId)) {
        throw new BadRequestException('usuarioId debe ser un número');
      }

      const usuarioExists = await this.prisma.usuario.findUnique({
        where: { id: usuarioId },
      });

      if (!usuarioExists) {
        throw new BadRequestException(`Usuario con ID ${usuarioId} no existe`);
      }

      data.user_id = usuarioId;
    }

    // Manejo de imagen
    if (file) {
      const nuevaImagenUrl = await this.s3Service.uploadFile(file, 'eventos');
      data.imagen_url = nuevaImagenUrl;

      // Eliminar imagen anterior de S3 si aplica
      if (
        eventoExists.imagen_url &&
        eventoExists.imagen_url.includes('s3.amazonaws.com')
      ) {
        await this.s3Service.deleteFile(eventoExists.imagen_url);
      }
    } else if (updateEventoDto.imagen_url !== undefined) {
      // Permitir setear/limpiar URL manualmente
      data.imagen_url = updateEventoDto.imagen_url;
    }

    try {
      const eventoActualizado = await this.prisma.evento.update({
        where: { id },
        data,
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
        message: 'Evento actualizado exitosamente',
        data: eventoActualizado,
      };
    } catch (error) {
      console.error('Error al actualizar evento:', error);
      throw new BadRequestException('Error al actualizar el evento');
    }
  }

  /**
   * Eliminar evento (y opcionalmente imagen en S3)
   */
  async remove(id: number) {
    const eventoExists = await this.prisma.evento.findUnique({
      where: { id },
    });

    if (!eventoExists) {
      throw new NotFoundException(`Evento con ID ${id} no encontrado`);
    }

    try {
      // Eliminar imagen de S3 si existe
      if (
        eventoExists.imagen_url &&
        eventoExists.imagen_url.includes('s3.amazonaws.com')
      ) {
        await this.s3Service.deleteFile(eventoExists.imagen_url);
      }

      await this.prisma.evento.delete({
        where: { id },
      });

      return {
        message: 'Evento eliminado exitosamente',
        data: { id },
      };
    } catch (error) {
      console.error('Error al eliminar evento:', error);
      throw new BadRequestException('Error al eliminar el evento');
    }
  }
}
