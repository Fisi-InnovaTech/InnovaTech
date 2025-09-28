import { Module } from '@nestjs/common';
import { EventosService } from './eventos.service';
import { EventosController } from './eventos.controller';

@Module({
  controllers: [EventosController],
  providers: [EventosService],
})
export class EventosModule {}
