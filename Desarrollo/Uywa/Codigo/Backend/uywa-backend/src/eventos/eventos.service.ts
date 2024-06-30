import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventoDto } from './dto/create-evento.dto';
import { UpdateEventoDto } from './dto/update-evento.dto';

@Injectable()
export class EventosService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createEventoDto: CreateEventoDto) {
    return this.prisma.evento.create({
      data: {
        ...createEventoDto,
        fecha: new Date(createEventoDto.fecha), // Asegúrate de convertir la fecha a un objeto Date
      },
    });
  }

  async findAll() {
    return this.prisma.evento.findMany();
  }

  async findOne(id: number) {
    const evento = await this.prisma.evento.findUnique({
      where: { id },
    });
    if (!evento) {
      throw new NotFoundException(`Evento con ID ${id} no encontrado`);
    }
    return evento;
  }

  async update(id: number, updateEventoDto: UpdateEventoDto) {
    const evento = await this.prisma.evento.findUnique({
      where: { id },
    });
    if (!evento) {
      throw new NotFoundException(`Evento con ID ${id} no encontrado`);
    }
    
    return this.prisma.evento.update({
      where: { id },
      data: {
        ...updateEventoDto,
        fecha: updateEventoDto.fecha ? new Date(updateEventoDto.fecha) : undefined, // Maneja la fecha correctamente
      },
    });
  }

  async remove(id: number) {
    const evento = await this.prisma.evento.findUnique({
      where: { id },
    });
    if (!evento) {
      throw new NotFoundException(`Evento con ID ${id} no encontrado`);
    }

    return this.prisma.evento.delete({
      where: { id },
    });
  }
}
