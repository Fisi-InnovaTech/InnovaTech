import { Module } from '@nestjs/common';
import { AlertasController } from './alertas.controller';
import { AlertasService } from './alertas.service';

@Module({
  controllers: [AlertasController],
  providers: [AlertasService]
})


export class AlertasModule {}
