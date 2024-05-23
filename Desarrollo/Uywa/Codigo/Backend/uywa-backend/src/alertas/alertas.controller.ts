import { Controller, Get, Post } from '@nestjs/common';
import { AlertasService } from './alertas.service';


//esta webada es el que me manda en todas las rutas
//la puedo cambiar por un objeto vacio para definir mis propias rutas
@Controller('alertas')
export class AlertasController {
  
    
    constructor ( private alertasService: AlertasService){}

    @Get('/')
    getAllAlertas() {
        return this.alertasService.getAlertas();
    }

    @Post('/')
    saveAlerta(){
        return 'Save alerta';
    }

}
