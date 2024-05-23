import { Module } from '@nestjs/common';
import { AuthUserService } from './auth-user.service';
import { AuthUserController } from './auth-user.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';


@Module({
  imports:[
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions: {expiresIn: '1h'}
    })
  ],
  //los injectables o services que uses en otras partes debes declararlos en el modulo
  providers: [AuthUserService, PrismaService],
  controllers: [AuthUserController],
  exports: [AuthUserService]
})
export class AuthUserModule {}
