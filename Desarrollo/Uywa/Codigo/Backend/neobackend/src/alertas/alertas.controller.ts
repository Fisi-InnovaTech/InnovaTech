import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AlertasService } from './alertas.service';
import { CreateAlertaDto } from './dto/create-alerta.dto';
import { UpdateAlertaDto } from './dto/update-alerta.dto';

@Controller('alertas')
export class AlertasController {
  constructor(private readonly alertasService: AlertasService) {}

  @Post()
  create(@Body() createAlertaDto: CreateAlertaDto) {
    return this.alertasService.create(createAlertaDto);
  }

  @Get()
  findAll() {
    return this.alertasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.alertasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAlertaDto: UpdateAlertaDto) {
    return this.alertasService.update(+id, updateAlertaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.alertasService.remove(+id);
  }
}
