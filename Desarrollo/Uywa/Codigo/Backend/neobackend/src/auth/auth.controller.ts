import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  HttpCode,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ResponseAuthDto } from './dto/reponse-auth.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { LoginAuthDto } from './dto/login-auth.dto';

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

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
