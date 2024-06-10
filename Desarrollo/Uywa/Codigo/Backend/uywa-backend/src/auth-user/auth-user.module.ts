import { Module } from '@nestjs/common';
import { AuthUserService } from './auth-user.service';
import { AuthUserController } from './auth-user.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

const ONE_MONTH : number=  30*24*60*60;

@Module({
  imports:[
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('SECRET'),
        signOptions: {expiresIn: ONE_MONTH}
      }),
      inject: [ConfigService]
    })
  ],
  //los injectables o services que uses en otras partes debes declararlos en el modulo
  providers: [AuthUserService, PrismaService],
  controllers: [AuthUserController],
  exports: [AuthUserService]
})
export class AuthUserModule {}
