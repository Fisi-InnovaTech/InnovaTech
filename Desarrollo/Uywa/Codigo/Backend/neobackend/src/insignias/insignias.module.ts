import { Module } from '@nestjs/common';
import { InsigniasService } from './insignias.service';
import { InsigniasController } from './insignias.controller';

@Module({
  controllers: [InsigniasController],
  providers: [InsigniasService],
})
export class InsigniasModule {}
