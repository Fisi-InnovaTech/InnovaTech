import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ReportesService } from './reportes.service';
import { ReportesController } from './reportes.controller';

@Module({
  controllers: [ReportesController],
  providers: [ReportesService, PrismaService],
})
export class ReportesModule {}
