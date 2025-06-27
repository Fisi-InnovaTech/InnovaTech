
import { Controller, Get, Body, Post, Query, UseGuards, UsePipes, ValidationPipe, UseInterceptors, UploadedFile } from '@nestjs/common';

import { AlertasService } from './alertas.service';
import { AlertasAuthDto } from './dto/AlertasAuth.dto';
import { AlertaFiltroDto } from './dto/AlertaFiltro.dto';
import { LocalAuthGuard } from 'src/auth-user/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadMiddleware } from './config/upload.middleware';
import { Multer } from 'multer';
//esta webada es el que me manda en todas las rutas
//la puedo cambiar por un objeto vacio para definir mis propias rutas
@Controller('/alertas')
export class AlertasController {
  
    
    constructor ( private alertasService: AlertasService){}

    //@UseGuards(LocalAuthGuard)
    @UsePipes(new ValidationPipe)
    @Post('/guardar')
    @UseInterceptors(FileInterceptor('evidencia_imagen', UploadMiddleware.getMulterOptions()))
    saveAlerta(
        @Body() alerta: AlertasAuthDto,
        @UploadedFile() file: Express.Multer.File
    ){
        if (file) {
            alerta.evidencia_imagen = file.path; // se asigna a la ruta del archivo subido
        }
        // conversión a número ya que se recibe como String
        alerta.latitud = +alerta.latitud;
        alerta.longitud = +alerta.longitud; 
        alerta.user_id = +alerta.user_id; 
        
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

    @Get('/allalerts')
    getReportes() {
        return this.alertasService.getAlertas();
    }

    @Post('/changingState')
    changeState(
        @Body() body: { 
            id: number, 
            estado: string, 
            reporte_detallado?: string 
        }
    ) {
        return this.alertasService.changeState(
            body.id,
            body.estado,
            body.reporte_detallado || null  
        );
    }
    
    // Funciones para la pestaña de estadísticas
    @Get('/alertsByYear')
    async getAlertsByYear(@Query('year') year: string) {
        return this.alertasService.getAlertsByYear(parseInt(year, 10));
    }

    @Get('/latestAlerts')
    async getLatestAlerts() {
        return this.alertasService.getLatestReports();
    }
}
