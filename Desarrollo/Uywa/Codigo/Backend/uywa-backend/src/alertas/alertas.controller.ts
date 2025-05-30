
import { Controller, Get, Body, Post, Query, UsePipes, ValidationPipe, UseInterceptors, UploadedFile } from '@nestjs/common';

import { AlertasService } from './alertas.service';
import { AlertasAuthDto } from './dto/AlertasAuth.dto';
import { AlertaFiltroDto } from './dto/AlertaFiltro.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadMiddleware } from './config/upload.middleware';
@Controller('/alertas')
export class AlertasController {
  
    
    constructor ( private readonly alertasService: AlertasService){}

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
    changeState(@Body() body: {id: number, estado: string}){
        return this.alertasService.changeState(body.id,body.estado);
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
