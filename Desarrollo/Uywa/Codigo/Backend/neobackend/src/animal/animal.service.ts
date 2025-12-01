import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { UpdateAnimalDto } from './dto/update-animal.dto';

@Injectable()
export class AnimalService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAnimalDto: CreateAnimalDto) {
    const nombreNormalizado = createAnimalDto.nombre.trim().toLowerCase();

    const animalExistente = await this.prisma.animal.findFirst({
      where: {
        nombre: {
          equals: nombreNormalizado,
          mode: 'insensitive',
        },
      },
    });

    if (animalExistente) {
      throw new BadRequestException(`El animal con nombre '${createAnimalDto.nombre}' ya existe.`);
    }

    const animal = await this.prisma.animal.create({ data: createAnimalDto });
    return { message: 'Animal creado correctamente', data: animal };
  }

  async findAll() {
    const animales = await this.prisma.animal.findMany();
    return { message: 'Animales encontrados correctamente', data: animales };
  }

  async findOne(id: number) {
    const animal = await this.prisma.animal.findUnique({ where: { id } });
    if (!animal) throw new NotFoundException(`Animal con ID ${id} no encontrado`);
    return { message: 'Animal encontrado correctamente', data: animal };
  }

  async update(id: number, updateAnimalDto: UpdateAnimalDto) {
    await this.findOne(id);
    return this.prisma.animal.update({ where: { id }, data: updateAnimalDto });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.animal.delete({ where: { id } });
    return { message: 'Animal eliminado correctamente' };
  }
}
