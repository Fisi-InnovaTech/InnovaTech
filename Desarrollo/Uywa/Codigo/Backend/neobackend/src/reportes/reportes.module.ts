import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ReportesService } from './reportes.service';
import { ReportesController } from './reportes.controller';
import { S3Service } from 'src/aws/s3.service';

@Module({
  controllers: [ReportesController],
  providers: [ReportesService, PrismaService, S3Service],
})
export class ReportesModule {}
