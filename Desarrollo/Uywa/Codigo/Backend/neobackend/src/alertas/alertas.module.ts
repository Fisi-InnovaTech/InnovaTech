import { Module } from '@nestjs/common';
import { AlertasService } from './alertas.service';
import { AlertasController } from './alertas.controller';

@Module({
  controllers: [AlertasController],
  providers: [AlertasService],
})
export class AlertasModule {}
