import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateReporteDto } from './dto/create-reporte.dto';
import { UpdateReporteDto } from './dto/update-reporte.dto';
import axios from 'axios';
import { S3Service } from 'src/aws/s3.service';

@Injectable()
export class ReportesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly s3Service: S3Service, // ✅
  ) {}

  async getAllReport() {
    return this.prisma.reporte.findMany({
      include: {
        usuario: {
          select: {
            id: true,
            nombres: true,
            apellidos: true,
            email: true,
          },
        },
        animal: true,
        evidencia: {
          include: {
            departamento: true,
          },
        },
      },
    });
  }
  async searchReportes(
    fecha_ini?: string,
    fecha_fin?: string,
    animal_id?: number,
    departamento_id?: string,
  ) {
    try {
      // Construir el objeto where dinámicamente
      const whereCondition: any = {};

      // Filtro por rango de fechas
      if (fecha_ini || fecha_fin) {
        whereCondition.fecha_creacion = {};

        if (fecha_ini) {
          const fechaInicio = new Date(fecha_ini);
          if (isNaN(fechaInicio.getTime())) {
            throw new BadRequestException(
              'fecha_ini debe ser una fecha válida (formato: YYYY-MM-DD)',
            );
          }
          // Establecer la hora al inicio del día
          fechaInicio.setHours(0, 0, 0, 0);
          whereCondition.fecha_creacion.gte = fechaInicio;
        }

        if (fecha_fin) {
          const fechaFin = new Date(fecha_fin);
          if (isNaN(fechaFin.getTime())) {
            throw new BadRequestException(
              'fecha_fin debe ser una fecha válida (formato: YYYY-MM-DD)',
            );
          }
          // Establecer la hora al final del día
          fechaFin.setHours(23, 59, 59, 999);
          whereCondition.fecha_creacion.lte = fechaFin;
        }
      }

      // Filtro por animal
      if (animal_id) {
        const animalIdNum = Number(animal_id);
        if (isNaN(animalIdNum)) {
          throw new BadRequestException('animal_id debe ser un número válido');
        }

        // Verificar que el animal existe
        const animalExists = await this.prisma.animal.findUnique({
          where: { id: animalIdNum },
        });

        if (!animalExists) {
          throw new BadRequestException(
            `Animal con ID ${animalIdNum} no existe`,
          );
        }

        whereCondition.animal_id = animalIdNum;
      }

      // 🔴 NUEVO: Filtro por departamento
      if (departamento_id) {
        // Verificar que el departamento existe
        const departamentoExists = await this.prisma.departamento.findUnique({
          where: { id: departamento_id },
        });

        if (!departamentoExists) {
          throw new BadRequestException(
            `Departamento con ID ${departamento_id} no existe`,
          );
        }

        // Filtrar por departamento a través de la relación con evidencia
        whereCondition.evidencia = {
          departamento_id: departamento_id,
        };
      }

      // Realizar la búsqueda
      const reportes = await this.prisma.reporte.findMany({
        where: whereCondition,
        include: {
          usuario: {
            select: {
              id: true,
              nombres: true,
              apellidos: true,
              email: true,
            },
          },
          animal: true,
          evidencia: {
            include: {
              departamento: true,
            },
          },
        },
        orderBy: {
          fecha_creacion: 'desc',
        },
      });

      return {
        message: 'Búsqueda realizada exitosamente',
        data: reportes,
        total: reportes.length,
        filtros: {
          fecha_ini: fecha_ini || null,
          fecha_fin: fecha_fin || null,
          animal_id: animal_id || null,
          departamento_id: departamento_id || null,
        },
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error('Error al buscar reportes:', error);
      throw new BadRequestException('Error al realizar la búsqueda');
    }
  }
  async getReporteByEstado(estado: string) {
    return this.prisma.reporte.findMany({
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
        animal: true,
        evidencia: {
          include: {
            departamento: true,
          },
        },
      },
    });
  }

  /**
   * Obtener departamento basado en latitud y longitud usando Nominatim
   */
  private async obtenerDepartamento(
    latitud: number,
    longitud: number,
  ): Promise<string> {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitud}&lon=${longitud}&format=json`,
      );

      const address = response.data.address;
      const departamento = address.state || address.region || address.county;

      if (!departamento) {
        throw new Error('No se pudo determinar el departamento');
      }

      // Buscar o crear el departamento en la base de datos
      let departamentoDb = await this.prisma.departamento.findFirst({
        where: { nombre: departamento },
      });

      if (!departamentoDb) {
        departamentoDb = await this.prisma.departamento.create({
          data: { nombre: departamento },
        });
      }

      return departamentoDb.id;
    } catch (error) {
      console.error('Error al obtener departamento:', error);
      throw new BadRequestException(
        'No se pudo determinar el departamento desde las coordenadas',
      );
    }
  }

  /**
   * Crear un reporte con evidencia separada
   */
  /*   async create(createReporteDto: CreateReporteDto, file?: Express.Multer.File) {

    try {
      // 🔹 Validar y convertir valores numéricos
      const usuarioId = Number(createReporteDto.usuarioId);
      const animal_id = Number(createReporteDto.animal_id);
      const latitud = Number(createReporteDto.latitud);
      const longitud = Number(createReporteDto.longitud);

      if (Number.isNaN(usuarioId)) {
        throw new BadRequestException('usuarioId debe ser un número');
      }
      if (Number.isNaN(animal_id)) {
        throw new BadRequestException('animal_id debe ser un número');
      }
      if (Number.isNaN(latitud) || Number.isNaN(longitud)) {
        throw new BadRequestException(
          'latitud y longitud deben ser valores numéricos',
        );
      }

      // 1. Verificar que el usuario existe
      const usuarioExists = await this.prisma.usuario.findUnique({
        where: { id: usuarioId },
      });

      if (!usuarioExists) {
        throw new BadRequestException(`Usuario con ID ${usuarioId} no existe`);
      }

      // 2. Verificar que el animal existe
      const animalExists = await this.prisma.animal.findUnique({
        where: { id: animal_id },
      });

      if (!animalExists) {
        throw new BadRequestException(`Animal con ID ${animal_id} no existe`);
      }

      // 3. Obtener departamento desde las coordenadas
      const departamentoId = await this.obtenerDepartamento(latitud, longitud);

      // 4. Construir la URL de la imagen
      let imagen_url: string | undefined = undefined;

      if (file) {
        const baseUrl =
          process.env.APP_BASE_URL || 'https://innovatech-ztzv.onrender.com';
        const normalizedPath = file.path.replace(/\\/g, '/');
        const imagePath = normalizedPath.startsWith('/')
          ? normalizedPath
          : `/${normalizedPath}`;
        imagen_url = `${baseUrl}${imagePath}`;
      } else if (createReporteDto.imagen_url) {
        imagen_url = createReporteDto.imagen_url;
      } else {
        throw new BadRequestException(
          'Se requiere una imagen para la evidencia',
        );
      }

      // 5. Crear la evidencia primero
      const evidencia = await this.prisma.evidencia.create({
        data: {
          descipcion: createReporteDto.descripcion,
          imagen_url: imagen_url,
          latitud,
          longitud,
          departamento_id: departamentoId,
        },
      });

      // 🔹 fecha_creacion opcional
      let fecha_creacion: Date | undefined = undefined;
      if (createReporteDto.fecha_creacion) {
        const parsed = new Date(createReporteDto.fecha_creacion);
        if (Number.isNaN(parsed.getTime())) {
          throw new BadRequestException(
            'fecha_creacion debe ser una fecha válida (ISO string)',
          );
        }
        fecha_creacion = parsed;
      }

      // 6. Crear el reporte vinculado a la evidencia
      const reporte = await this.prisma.reporte.create({
        data: {
          estado: createReporteDto.estado || 'pendiente',
          animal_id,
          evidencia_id: evidencia.id,
          usuario_id: usuarioId,
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
          animal: true,
          evidencia: {
            include: {
              departamento: true,
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
 */

  async create(createReporteDto: CreateReporteDto, file?: Express.Multer.File) {
    try {
      // 🔹 Validar y convertir valores numéricos
      const usuarioId = Number(createReporteDto.usuarioId);
      const animal_id = Number(createReporteDto.animal_id);
      const latitud = Number(createReporteDto.latitud);
      const longitud = Number(createReporteDto.longitud);

      if (Number.isNaN(usuarioId)) {
        throw new BadRequestException('usuarioId debe ser un número');
      }
      if (Number.isNaN(animal_id)) {
        throw new BadRequestException('animal_id debe ser un número');
      }
      if (Number.isNaN(latitud) || Number.isNaN(longitud)) {
        throw new BadRequestException(
          'latitud y longitud deben ser valores numéricos',
        );
      }

      // 1. Verificar que el usuario existe
      const usuarioExists = await this.prisma.usuario.findUnique({
        where: { id: usuarioId },
      });

      if (!usuarioExists) {
        throw new BadRequestException(`Usuario con ID ${usuarioId} no existe`);
      }

      // 2. Verificar que el animal existe
      const animalExists = await this.prisma.animal.findUnique({
        where: { id: animal_id },
      });

      if (!animalExists) {
        throw new BadRequestException(`Animal con ID ${animal_id} no existe`);
      }

      // 3. Obtener departamento desde las coordenadas
      const departamentoId = await this.obtenerDepartamento(latitud, longitud);

      // 4. 🔴 MODIFICADO: Subir imagen a S3 o usar URL manual
      let imagen_url: string | undefined = undefined;

      if (file) {
        // Subir a S3
        imagen_url = await this.s3Service.uploadFile(file, 'reportes');
      } else if (createReporteDto.imagen_url) {
        // Usar URL manual si no hay archivo
        imagen_url = createReporteDto.imagen_url;
      } else {
        throw new BadRequestException(
          'Se requiere una imagen para la evidencia',
        );
      }

      // 5. Crear la evidencia primero
      const evidencia = await this.prisma.evidencia.create({
        data: {
          descipcion: createReporteDto.descripcion,
          imagen_url: imagen_url,
          latitud,
          longitud,
          departamento_id: departamentoId,
        },
      });

      // 🔹 fecha_creacion opcional
      let fecha_creacion: Date | undefined = undefined;
      if (createReporteDto.fecha_creacion) {
        const parsed = new Date(createReporteDto.fecha_creacion);
        if (Number.isNaN(parsed.getTime())) {
          throw new BadRequestException(
            'fecha_creacion debe ser una fecha válida (ISO string)',
          );
        }
        fecha_creacion = parsed;
      }

      // 6. Crear el reporte vinculado a la evidencia
      const reporte = await this.prisma.reporte.create({
        data: {
          estado: createReporteDto.estado || 'pendiente',
          animal_id,
          evidencia_id: evidencia.id,
          usuario_id: usuarioId,
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
          animal: true,
          evidencia: {
            include: {
              departamento: true,
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
        animal: true,
        evidencia: {
          include: {
            departamento: true,
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
    console.log('ID RECIBIDO:', id, 'TIPO:', typeof id);
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
        animal: true,
        evidencia: {
          include: {
            departamento: true,
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
      where: { usuario_id: usuarioId },
      include: {
        usuario: {
          select: {
            id: true,
            nombres: true,
            apellidos: true,
            email: true,
          },
        },
        animal: true,
        evidencia: {
          include: {
            departamento: true,
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
        animal: true,
        evidencia: {
          include: {
            departamento: true,
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

  async updateState(id: number, estado: string) {
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
        data: { estado },
        include: {
          usuario: {
            select: {
              id: true,
              nombres: true,
              apellidos: true,
              email: true,
            },
          },
          animal: true,
          evidencia: {
            include: {
              departamento: true,
            },
          },
        },
      });
      return {
        message: 'Estado del reporte actualizado exitosamente',
        data: reporteActualizado,
      };
    } catch (error) {
      console.error('Error al actualizar estado del reporte:', error);
      throw new BadRequestException(
        'Error al actualizar el estado del reporte',
      );
    }
  }

  private async eliminarImagenAnterior(imagenUrl: string): Promise<void> {
    try {
      if (imagenUrl && imagenUrl.includes('/uploads/')) {
        // Extraer el nombre del archivo de la URL
        const filename = imagenUrl.split('/').pop();
        if (filename) {
          const fs = require('fs/promises');
          const path = require('path');
          const filePath = path.join(process.cwd(), 'uploads', filename);

          // Verificar si el archivo existe antes de eliminarlo
          try {
            await fs.access(filePath);
            await fs.unlink(filePath);
            console.log(`Imagen anterior eliminada: ${filename}`);
          } catch (accessError) {
            console.warn(`Imagen no encontrada para eliminar: ${filename}`);
          }
        }
      }
    } catch (error) {
      console.warn('No se pudo eliminar la imagen anterior:', error);
    }
  }

  /*   async update(
    id: number,
    updateReporteDto: UpdateReporteDto,
    file?: Express.Multer.File,
  ) {
    // Verificar que el reporte existe
    const reporteExists = await this.prisma.reporte.findUnique({
      where: { id },
      include: {
        evidencia: true,
      },
    });

    if (!reporteExists) {
      throw new NotFoundException(`Reporte con ID ${id} no encontrado`);
    }

    // Datos para actualizar el reporte
    const reporteUpdateData: any = {};

    if (updateReporteDto.estado) {
      reporteUpdateData.estado = updateReporteDto.estado;
    }

    if (updateReporteDto.animal_id) {
      // Verificar que el animal existe
      const animalExists = await this.prisma.animal.findUnique({
        where: { id: updateReporteDto.animal_id },
      });

      if (!animalExists) {
        throw new BadRequestException(
          `Animal con ID ${updateReporteDto.animal_id} no existe`,
        );
      }

      reporteUpdateData.animal_id = updateReporteDto.animal_id;
    }

    // Datos para actualizar la evidencia
    const evidenciaUpdateData: any = {};

    if (updateReporteDto.descripcion) {
      evidenciaUpdateData.descipcion = updateReporteDto.descripcion;
    }

    // ✅ CORRECCIÓN: Manejo simplificado de imagen
    if (file) {
      const baseUrl =
        process.env.APP_BASE_URL || 'https://innovatech-ztzv.onrender.com';
      const normalizedPath = file.path.replace(/\\/g, '/');
      const imagePath = normalizedPath.startsWith('/')
        ? normalizedPath
        : `/${normalizedPath}`;
      evidenciaUpdateData.imagen_url = `${baseUrl}${imagePath}`;

      // 🔴 Opcional: Eliminar imagen anterior si existe
      await this.eliminarImagenAnterior(reporteExists.evidencia.imagen_url);
    }
    // ✅ Si no hay archivo, mantener la imagen actual (no hacer nada)

    // Manejo de coordenadas y departamento
    if (
      updateReporteDto.latitud !== undefined ||
      updateReporteDto.longitud !== undefined
    ) {
      const latitud =
        updateReporteDto.latitud !== undefined
          ? Number(updateReporteDto.latitud)
          : reporteExists.evidencia.latitud;

      const longitud =
        updateReporteDto.longitud !== undefined
          ? Number(updateReporteDto.longitud)
          : reporteExists.evidencia.longitud;

      if (Number.isNaN(latitud) || Number.isNaN(longitud)) {
        throw new BadRequestException(
          'latitud y longitud deben ser valores numéricos',
        );
      }

      evidenciaUpdateData.latitud = latitud;
      evidenciaUpdateData.longitud = longitud;

      // Recalcular departamento si cambian las coordenadas
      if (
        updateReporteDto.latitud !== undefined ||
        updateReporteDto.longitud !== undefined
      ) {
        const departamentoId = await this.obtenerDepartamento(
          latitud,
          longitud,
        );
        evidenciaUpdateData.departamento_id = departamentoId;
      }
    }

    try {
      // Actualizar en transacción para asegurar consistencia
      const result = await this.prisma.$transaction(async (tx) => {
        // Actualizar evidencia si hay datos que cambiar
        if (Object.keys(evidenciaUpdateData).length > 0) {
          await tx.evidencia.update({
            where: { id: reporteExists.evidencia_id },
            data: evidenciaUpdateData,
          });
        }

        // Actualizar reporte si hay datos que cambiar
        if (Object.keys(reporteUpdateData).length > 0) {
          const reporteActualizado = await tx.reporte.update({
            where: { id },
            data: reporteUpdateData,
            include: {
              usuario: {
                select: {
                  id: true,
                  nombres: true,
                  apellidos: true,
                  email: true,
                },
              },
              animal: true,
              evidencia: {
                include: {
                  departamento: true,
                },
              },
            },
          });
          return reporteActualizado;
        } else {
          // Si no hay cambios en el reporte, devolver el existente con evidencia actualizada
          return await tx.reporte.findUnique({
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
              animal: true,
              evidencia: {
                include: {
                  departamento: true,
                },
              },
            },
          });
        }
      });

      return {
        message: 'Reporte actualizado exitosamente',
        data: result,
      };
    } catch (error) {
      console.error('Error al actualizar reporte:', error);
      throw new BadRequestException('Error al actualizar el reporte');
    }
  } */

  async update(
    id: number,
    updateReporteDto: UpdateReporteDto,
    file?: Express.Multer.File,
  ) {
    // Verificar que el reporte existe
    const reporteExists = await this.prisma.reporte.findUnique({
      where: { id },
      include: {
        evidencia: true,
      },
    });

    if (!reporteExists) {
      throw new NotFoundException(`Reporte con ID ${id} no encontrado`);
    }

    // Datos para actualizar el reporte
    const reporteUpdateData: any = {};

    if (updateReporteDto.estado) {
      reporteUpdateData.estado = updateReporteDto.estado;
    }

    if (updateReporteDto.animal_id) {
      // Verificar que el animal existe
      const animalExists = await this.prisma.animal.findUnique({
        where: { id: updateReporteDto.animal_id },
      });

      if (!animalExists) {
        throw new BadRequestException(
          `Animal con ID ${updateReporteDto.animal_id} no existe`,
        );
      }

      reporteUpdateData.animal_id = updateReporteDto.animal_id;
    }

    // Datos para actualizar la evidencia
    const evidenciaUpdateData: any = {};

    if (updateReporteDto.descripcion) {
      evidenciaUpdateData.descipcion = updateReporteDto.descripcion;
    }

    // 🔴 MODIFICADO: Manejo de imagen con S3
    if (file) {
      // Subir nueva imagen a S3
      const nuevaImagenUrl = await this.s3Service.uploadFile(file, 'reportes');
      evidenciaUpdateData.imagen_url = nuevaImagenUrl;

      // Eliminar imagen anterior de S3 si existe
      if (
        reporteExists.evidencia.imagen_url &&
        reporteExists.evidencia.imagen_url.includes('s3.amazonaws.com')
      ) {
        await this.s3Service.deleteFile(reporteExists.evidencia.imagen_url);
      }
    }
    // Si no hay archivo, mantener la imagen actual (no hacer nada)

    // Manejo de coordenadas y departamento
    if (
      updateReporteDto.latitud !== undefined ||
      updateReporteDto.longitud !== undefined
    ) {
      const latitud =
        updateReporteDto.latitud !== undefined
          ? Number(updateReporteDto.latitud)
          : reporteExists.evidencia.latitud;

      const longitud =
        updateReporteDto.longitud !== undefined
          ? Number(updateReporteDto.longitud)
          : reporteExists.evidencia.longitud;

      if (Number.isNaN(latitud) || Number.isNaN(longitud)) {
        throw new BadRequestException(
          'latitud y longitud deben ser valores numéricos',
        );
      }

      evidenciaUpdateData.latitud = latitud;
      evidenciaUpdateData.longitud = longitud;

      // Recalcular departamento si cambian las coordenadas
      if (
        updateReporteDto.latitud !== undefined ||
        updateReporteDto.longitud !== undefined
      ) {
        const departamentoId = await this.obtenerDepartamento(
          latitud,
          longitud,
        );
        evidenciaUpdateData.departamento_id = departamentoId;
      }
    }

    try {
      // Actualizar en transacción para asegurar consistencia
      const result = await this.prisma.$transaction(async (tx) => {
        // Actualizar evidencia si hay datos que cambiar
        if (Object.keys(evidenciaUpdateData).length > 0) {
          await tx.evidencia.update({
            where: { id: reporteExists.evidencia_id },
            data: evidenciaUpdateData,
          });
        }

        // Actualizar reporte si hay datos que cambiar
        if (Object.keys(reporteUpdateData).length > 0) {
          const reporteActualizado = await tx.reporte.update({
            where: { id },
            data: reporteUpdateData,
            include: {
              usuario: {
                select: {
                  id: true,
                  nombres: true,
                  apellidos: true,
                  email: true,
                },
              },
              animal: true,
              evidencia: {
                include: {
                  departamento: true,
                },
              },
            },
          });
          return reporteActualizado;
        } else {
          // Si no hay cambios en el reporte, devolver el existente con evidencia actualizada
          return await tx.reporte.findUnique({
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
              animal: true,
              evidencia: {
                include: {
                  departamento: true,
                },
              },
            },
          });
        }
      });

      return {
        message: 'Reporte actualizado exitosamente',
        data: result,
      };
    } catch (error) {
      console.error('Error al actualizar reporte:', error);
      throw new BadRequestException('Error al actualizar el reporte');
    }
  }

  /*     async remove(id: number) {
    // Verificar que el reporte existe
    const reporteExists = await this.prisma.reporte.findUnique({
      where: { id },
      include: {
        evidencia: true,
      },
    });

    if (!reporteExists) {
      throw new NotFoundException(`Reporte con ID ${id} no encontrado`);
    }

    try {
      // Eliminar en transacción: primero el reporte, luego la evidencia
      await this.prisma.$transaction([
        this.prisma.reporte.delete({
          where: { id },
        }),
        this.prisma.evidencia.delete({
          where: { id: reporteExists.evidencia_id },
        }),
      ]);

      return {
        message: 'Reporte eliminado exitosamente',
        data: { id },
      };
    } catch (error) {
      console.error('Error al eliminar reporte:', error);
      throw new BadRequestException('Error al eliminar el reporte');
    }
  } */

  async remove(id: number) {
    // Verificar que el reporte existe
    const reporteExists = await this.prisma.reporte.findUnique({
      where: { id },
      include: {
        evidencia: true,
      },
    });

    if (!reporteExists) {
      throw new NotFoundException(`Reporte con ID ${id} no encontrado`);
    }

    try {
      // Eliminar imagen de S3 si existe
      if (
        reporteExists.evidencia.imagen_url &&
        reporteExists.evidencia.imagen_url.includes('s3.amazonaws.com')
      ) {
        await this.s3Service.deleteFile(reporteExists.evidencia.imagen_url);
      }

      // Eliminar en transacción: primero el reporte, luego la evidencia
      await this.prisma.$transaction([
        this.prisma.reporte.delete({
          where: { id },
        }),
        this.prisma.evidencia.delete({
          where: { id: reporteExists.evidencia_id },
        }),
      ]);

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
