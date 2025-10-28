import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const jwtSecret = configService.get<string>('JWT_SECRET');
        if (!jwtSecret) {
          throw new Error(
            'JWT_SECRET no está definido en las variables de entorno',
          );
        }

        return {
          secret: jwtSecret,
          signOptions: {
            expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '1d',
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService],
  exports: [AuthService],
})
export class AuthModule {}
