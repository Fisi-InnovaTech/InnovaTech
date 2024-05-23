import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AlertasService } from './alertas.service';
import { LocalAuthGuard } from 'src/auth-user/jwt-auth.guard';

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

    @Post('/')
    saveAlerta(){
        return 'Save alerta';
    }

}
