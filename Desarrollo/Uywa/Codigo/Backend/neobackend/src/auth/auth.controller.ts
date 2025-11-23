import {
  Controller,
  Get,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  HttpCode,
  BadRequestException,
  UnauthorizedException,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ResponseAuthDto } from './dto/reponse-auth.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { AuthGuard } from './auth.guard';

// Interfaz para el request con user
interface AuthenticatedRequest extends Request {
  user: {
    sub: number;
    email: string;
    rol: string;
  };
}
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  )
  @HttpCode(201)
  @Post('register')
  @ApiOperation({ summary: 'Registrar un nuevo usuario' })
  @ApiBody({ type: RegisterAuthDto })
  @ApiCreatedResponse({
    description: 'El usuario fue creado exitosamente',
    type: ResponseAuthDto,
  })
  @ApiBadRequestResponse({
    description:
      'Error en la solicitud. Por ejemplo, el correo ya está registrado o datos inválidos.',
  })
  async register(
    @Body() registerAuthDto: RegisterAuthDto,
  ): Promise<ResponseAuthDto> {
    try {
      return this.authService.register_user(registerAuthDto);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new BadRequestException('User registration failed');
    }
  }

  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  )
  @HttpCode(200)
  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiBody({ type: LoginAuthDto })
  @ApiCreatedResponse({
    description: 'Login exitoso',
    type: LoginResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Credenciales inválidas',
  })
  @ApiBadRequestResponse({
    description: 'Datos de entrada inválidos',
  })
  async login(@Body() loginAuthDto: LoginAuthDto): Promise<LoginResponseDto> {
    try {
      return await this.authService.login(loginAuthDto);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
  }

  // ✅ NUEVA RUTA: Verificar si el token es válido
  @UseGuards(AuthGuard)
  @Get('verify')
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verificar validez del token JWT' })
  @ApiOkResponse({
    description: 'Token válido',
    schema: {
      type: 'object',
      properties: {
        valid: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Token válido' },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Token inválido o expirado',
  })
  verifyToken(@Request() req: AuthenticatedRequest) {
    // Si llegó aquí, el AuthGuard ya validó el token
    return {
      valid: true,
      message: 'Token válido',
      user: {
        id: req.user.sub,
        email: req.user.email,
        rol: req.user.rol,
      },
    };
  }

  // ✅ NUEVA RUTA: Obtener información del usuario autenticado
  @UseGuards(AuthGuard)
  @Get('me')
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener información del usuario autenticado' })
  @ApiOkResponse({
    description: 'Información del usuario',
    type: ResponseAuthDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Token inválido o usuario no encontrado',
  })
  async getMe(@Request() req: AuthenticatedRequest) {
    return await this.authService.getUserById(req.user.sub);
  }
}
