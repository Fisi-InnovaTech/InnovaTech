import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { compare, hash } from 'bcrypt';
import { ResponseAuthDto } from './dto/reponse-auth.dto';
import { Prisma } from 'generated/prisma';
import { LoginResponseDto } from './dto/login-response.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

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

  async login(loginDto: LoginAuthDto): Promise<LoginResponseDto> {
    const { email, password } = loginDto;

    // Buscar usuario por email incluyendo el rol
    const user = await this.prisma.usuario.findUnique({
      where: { email },
      include: {
        rol: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Verificar contraseña
    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Generar token JWT
    const payload = {
      sub: user.id,
      email: user.email,
      rol: user.rol.nombre,
    };

    const access_token = await this.jwtService.signAsync(payload);

    const response: LoginResponseDto = {
      email: user.email,
      nombres: user.nombres,
      apellidos: user.apellidos,
      rol: user.rol.nombre,
      access_token,
    };

    return response;
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
