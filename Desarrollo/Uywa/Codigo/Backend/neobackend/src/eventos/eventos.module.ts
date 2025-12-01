import { Module } from '@nestjs/common';
import { EventosService } from './eventos.service';
import { EventosController } from './eventos.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { S3Service } from 'src/aws/s3.service';

@Module({
  controllers: [EventosController],
  providers: [EventosService, PrismaService, S3Service],
})
export class EventosModule {}
