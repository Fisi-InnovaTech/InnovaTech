import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AlertasService } from './alertas.service';
import { LocalAuthGuard } from 'src/auth-user/jwt-auth.guard';
import { AlertaFechaLugarDto } from './dto/AlertaFechaLugar.dto';
import { reporte } from '@prisma/client';

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

    @Post('/') // Test
    saveAlerta(@Body() alerta: reporte){
        return this.alertasService.createAlerta(alerta);
    }

    @Get('/search')
    @UseGuards(LocalAuthGuard)
    getAlertaByFechaAndDireccion(
        @Query() alerta : AlertaFechaLugarDto
    ) {
        return this.alertasService.getAlertaByFechaAndDireccion(alerta);
    }
}
