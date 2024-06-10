import { Controller, Get, Body, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AlertasService } from './alertas.service';
import { AlertasAuthDto } from './dto/AlertasAuth.dto';
import { AlertaFiltroDto } from './dto/AlertaFiltro.dto';
import { LocalAuthGuard } from 'src/auth-user/jwt-auth.guard';

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

    @UsePipes(new ValidationPipe)
    @Get('/search')
    getAlertaByFilter(@Query() alerta : AlertaFiltroDto) {
        return this.alertasService.getAlertaByFilter(alerta);
    }
}
