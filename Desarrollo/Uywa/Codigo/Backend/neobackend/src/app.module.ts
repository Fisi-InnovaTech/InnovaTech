import { Module } from '@nestjs/common';
import { EventosModule } from './eventos/eventos.module';
import { AuthModule } from './auth/auth.module';
import { InsigniasModule } from './insignias/insignias.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { PrismaModule } from './prisma/prisma.module';
import { ReportesModule } from './reportes/reportes.module';

@Module({
  imports: [
    EventosModule,
    AuthModule,
    InsigniasModule,
    UsuariosModule,
    PrismaModule,
    ReportesModule,
  ],
})
export class AppModule {}
