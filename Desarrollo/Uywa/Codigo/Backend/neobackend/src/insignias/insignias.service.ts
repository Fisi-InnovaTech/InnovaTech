import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateInsigniaDto } from './dto/create-insignia.dto';
import { UpdateInsigniaDto } from './dto/update-insignia.dto';

@Injectable()
export class InsigniasService {
  constructor(private prisma: PrismaService) {}

  create(createInsigniaDto: CreateInsigniaDto) {
    return 'This action adds a new insignia';
  }

  async calcularBadge(id: number) {
    const total = await this.prisma.reporte.count({
      where: { usuarioId: id },
    });

    if (total >= 10) return { total, badge: 'Defensor de la fauna' };
    if (total >= 5) return { total, badge: 'Guardabosques activo' };
    return { total, badge: 'Ciudadano responsable' };
  }

  findAll() {
    return `This action returns all insignias`;
  }

  findOne(id: number) {
    return `This action returns a #${id} insignia`;
  }

  update(id: number, updateInsigniaDto: UpdateInsigniaDto) {
    return `This action updates a #${id} insignia`;
  }

  remove(id: number) {
    return `This action removes a #${id} insignia`;
  }
}
