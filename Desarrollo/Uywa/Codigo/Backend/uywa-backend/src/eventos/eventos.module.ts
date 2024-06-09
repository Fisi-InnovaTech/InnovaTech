import { Module } from '@nestjs/common';
import { EventosService } from './eventos.service';
import { EventosController } from './eventos.controller';
import {PrismaService} from '../prisma/prisma.service';

@Module({
  controllers: [EventosController],
  providers: [EventosService, PrismaService]
})
export class EventosModule {}
