import {  Module } from '@nestjs/common';
import { AlertasModule } from './alertas/alertas.module';
import { AuthUserModule } from './auth-user/auth-user.module';
import { PrismaModule } from './prisma/prisma.module';
import { EventosModule } from './eventos/eventos.module';
import { InsigniasModule } from './insignias/insignias.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';



@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    AlertasModule, 
    AuthUserModule, 
    PrismaModule, 
    EventosModule, 
    InsigniasModule
  ],
  controllers: [],
  providers: [],

})
export class AppModule {}
