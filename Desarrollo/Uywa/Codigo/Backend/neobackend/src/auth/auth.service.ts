/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { hash } from 'bcrypt';
import { ResponseAuthDto } from './dto/reponse-auth.dto';
import { Prisma } from 'generated/prisma';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async register_user(user: RegisterAuthDto): Promise<ResponseAuthDto> {
    const { password } = user;
    const hashedPassword = await hash(password, 10);

    try {
      const newUser = await this.prisma.usuario.create({
        data: {
          ...user,
          password: hashedPassword,
          fechaNacimiento: new Date(user.fechaNacimiento),
        },
      });

      const response: ResponseAuthDto = {
        email: newUser.email,
        nombres: newUser.nombres,
        apellidos: newUser.apellidos,
      };

      return response;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new BadRequestException(
          'El correo ya está registrado, prueba con otro.',
        );
      }
      throw new BadRequestException('User registration failed');
    }
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
