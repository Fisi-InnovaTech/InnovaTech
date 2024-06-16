import {  Module } from '@nestjs/common';
import { AlertasModule } from './alertas/alertas.module';
import { AuthUserModule } from './auth-user/auth-user.module';
import { PrismaModule } from './prisma/prisma.module';
import { EventosModule } from './eventos/eventos.module';
import { InsigniasModule } from './insignias/insignias.module';




@Module({
  imports: [AlertasModule, AuthUserModule, PrismaModule, EventosModule, InsigniasModule],
  controllers: [],
  providers: [],

})
export class AppModule {}
