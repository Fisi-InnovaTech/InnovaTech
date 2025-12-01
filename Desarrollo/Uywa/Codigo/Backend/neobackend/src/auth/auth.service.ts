import {
  BadRequestException,
  Injectable,
  NotFoundException,
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

  //registrar usuario
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
      console.error('Error registering user:', error);
      throw new BadRequestException('User registration failed');
    }
  }

  //login con jwt
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

  // ✅ NUEVO MÉTODO: Obtener usuario por ID
  async getUserById(userId: number): Promise<ResponseAuthDto> {
    const user = await this.prisma.usuario.findUnique({
      where: { id: userId },
      include: {
        rol: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const response: ResponseAuthDto = {
      email: user.email,
      nombres: user.nombres,
      apellidos: user.apellidos,
      // Puedes agregar más campos si los necesitas
    };

    return response;
  }
}
