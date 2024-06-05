import {  Module } from '@nestjs/common';
import { AlertasModule } from './alertas/alertas.module';
import { AuthUserModule } from './auth-user/auth-user.module';
import { PrismaModule } from './prisma/prisma.module';
import { EventosModule } from './eventos/eventos.module';




@Module({
  imports: [AlertasModule, AuthUserModule, PrismaModule, EventosModule],

})
export class AppModule {}
