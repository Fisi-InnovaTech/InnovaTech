import { Module } from '@nestjs/common';
import { AlertasController } from './alertas.controller';
import { AlertasService } from './alertas.service';
import { JwtStrategy } from 'src/auth-user/jwt.strategy';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [AlertasController],
  providers: [AlertasService, JwtStrategy, PrismaService]
})


export class AlertasModule {}
