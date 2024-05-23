import { Module } from '@nestjs/common';
import { AlertasController } from './alertas.controller';
import { AlertasService } from './alertas.service';
import { JwtStrategy } from 'src/auth-user/jwt.strategy';

@Module({
  controllers: [AlertasController],
  providers: [AlertasService, JwtStrategy]
})


export class AlertasModule {}
