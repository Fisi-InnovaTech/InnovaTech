import { Module } from '@nestjs/common';
import { EventosModule } from './eventos/eventos.module';
import { AuthModule } from './auth/auth.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { PrismaModule } from './prisma/prisma.module';
import { ReportesModule } from './reportes/reportes.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Hacer que ConfigModule sea global
    EventosModule,
    AuthModule,
    UsuariosModule,
    PrismaModule,
    ReportesModule,
  ],
})
export class AppModule {}
