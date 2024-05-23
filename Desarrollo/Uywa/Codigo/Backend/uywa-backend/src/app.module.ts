import {  Module } from '@nestjs/common';
import { AlertasModule } from './alertas/alertas.module';
import { AuthUserModule } from './auth-user/auth-user.module';
import { PrismaModule } from './prisma/prisma.module';




@Module({
  imports: [AlertasModule, AuthUserModule, PrismaModule],

})
export class AppModule {}
