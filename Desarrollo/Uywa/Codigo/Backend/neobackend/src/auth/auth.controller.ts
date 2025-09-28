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
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { ResponseAuthDto } from './dto/reponse-auth.dto';

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

  @Post('login')
  login() {
    return 'Login endpoint';
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
