import { Body, Controller, Get, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { AlertasService } from './alertas.service';
import { AlertasAuthDto } from './dto/AlertasAuth.dto';
import { LocalAuthGuard } from 'src/auth-user/jwt-auth.guard';
import { AlertaFechaLugarDto } from './dto/AlertaFechaLugar.dto';
import { reporte } from '@prisma/client';

//esta webada es el que me manda en todas las rutas
//la puedo cambiar por un objeto vacio para definir mis propias rutas
@Controller('/alertas')
export class AlertasController {
  
    
    constructor ( private alertasService: AlertasService){}

    @UsePipes(new ValidationPipe)
    @Post('/guardar')
    async saveAlerta(@Body() body: AlertasAuthDto){
        return this.alertasService.createAlerta(body);
    }

    @Get('/allmap')
    async getall(){
        return this.alertasService.getLocations();
    }

    @Get('/basic')
    async getBasic(){
        return this.alertasService.getBasic();
    }

    @Get('/search')
    getAlertaByFechaAndDireccion(
        @Query() alerta : AlertaFechaLugarDto
    ) {
        return this.alertasService.getAlertaByFechaAndDireccion(alerta);
    }

    

}