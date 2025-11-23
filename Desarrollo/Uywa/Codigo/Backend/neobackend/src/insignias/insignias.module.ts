import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { InsigniasService } from './insignias.service';
import { InsigniasController } from './insignias.controller';

@Module({
  controllers: [InsigniasController],
  providers: [InsigniasService, PrismaService],
})
export class InsigniasModule {}
