import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { InsigniasService } from './insignias.service';

@Controller('insignias')
export class InsigniasController {

    constructor(private insigniasService: InsigniasService) {}

    // Get all insignias from usuario model
    //@UsePipes(new ValidationPipe)
    @Get('/:id')
    getInsignias(@Param('id') id: number) {
        return this.insigniasService.getInsignias(id);
    }
    
    // Post a new insignia to usuario model
    // Esto es en base a la tabla reporte, que contiene la relacion con usuario en user_id
    // Se hace un llamado a la cantidad de reportes que tiene un usuario y se le asigna una insignia
    // Para tener la cantidad, se hace un count de los reportes que tiene un usuario dependiendo del user_id
    // Luego se le asigna una insignia dependiendo de la cantidad de reportes que tenga

    //@UsePipes(new ValidationPipe)
    @Post('/update/:id')
    updateInsignia(@Param('id') id: number) {
        return this.insigniasService.updateInsignia(id);
    }
}
