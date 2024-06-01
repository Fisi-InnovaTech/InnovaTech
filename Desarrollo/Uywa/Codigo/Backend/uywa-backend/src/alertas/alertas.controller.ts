import { Controller, Get, Body, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AlertasService } from './alertas.service';
import { AlertasAuthDto } from './dto/AlertasAuth.dto';
import { LocalAuthGuard } from 'src/auth-user/jwt-auth.guard';
import { AlertaFechaLugarDto } from './dto/AlertaFechaLugar.dto';

//esta webada es el que me manda en todas las rutas
//la puedo cambiar por un objeto vacio para definir mis propias rutas
@Controller('/alertas')
export class AlertasController {
  
    
    constructor ( private alertasService: AlertasService){}

    //@UseGuards(LocalAuthGuard)
    @UsePipes(new ValidationPipe)
    @Post('/guardar')
    saveAlerta(@Body() alerta: AlertasAuthDto){
        return this.alertasService.createAlerta(alerta);
    }

    @Get('/allmap')
    getLocation() {
        return this.alertasService.getLocations();
    }

    //@UseGuards(LocalAuthGuard)
    @Get('/basic')
    getAllAlertas() {
        return this.alertasService.getBasic();
    }

    //@UseGuards(LocalAuthGuard)
    @UsePipes(new ValidationPipe)
    @Get('/search')
    getAlertaByFechaAndDireccion(@Query() alerta : AlertaFechaLugarDto) {
        return this.alertasService.getAlertaByFechaAndDireccion(alerta);
    }
}
