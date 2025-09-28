import { Module } from '@nestjs/common';
import { AlertasModule } from './alertas/alertas.module';
import { EventosModule } from './eventos/eventos.module';
import { AuthModule } from './auth/auth.module';
import { InsigniasModule } from './insignias/insignias.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    AlertasModule,
    EventosModule,
    AuthModule,
    InsigniasModule,
    UsuariosModule,
    PrismaModule,
  ],
})
export class AppModule {}
