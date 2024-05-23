import { Controller, Get, Body, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AlertasService } from './alertas.service';
import { LocalAuthGuard } from 'src/auth-user/jwt-auth.guard';
import { AlertasAuthDto } from './dto/AlertasAuth.dto';

//esta webada es el que me manda en todas las rutas
//la puedo cambiar por un objeto vacio para definir mis propias rutas
@Controller('alertas')
export class AlertasController {
  
    
    constructor ( private alertasService: AlertasService){}
    @UseGuards(LocalAuthGuard)
    @Get('/')
    getAllAlertas() {
        return this.alertasService.getAlertas();
    }

    @UseGuards(LocalAuthGuard)
    @UsePipes(new ValidationPipe)
    @Post('/')
    async saveAlerta(@Body() alerta: AlertasAuthDto){
        return this.alertasService.registerAlerta(alerta);
    }

}
