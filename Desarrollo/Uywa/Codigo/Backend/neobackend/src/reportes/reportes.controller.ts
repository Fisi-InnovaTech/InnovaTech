import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ReportesService } from './reportes.service';
import { CreateReporteDto } from './dto/create-reporte.dto';
import { UpdateReporteDto } from './dto/update-reporte.dto';

@Controller('reportes')
export class ReportesController {
  constructor(private readonly reportesService: ReportesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createReporteDto: CreateReporteDto) {
    return this.reportesService.create(createReporteDto);
  }

  @Get()
  findAll(@Query('estado') estado?: string) {
    if (estado) {
      return this.reportesService.findByEstado(estado);
    }
    return this.reportesService.findAll();
  }

  @Get('usuario/:usuarioId')
  findByUsuario(@Param('usuarioId', ParseIntPipe) usuarioId: number) {
    return this.reportesService.findByUsuario(usuarioId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.reportesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateReporteDto: UpdateReporteDto,
  ) {
    return this.reportesService.update(id, updateReporteDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.reportesService.remove(id);
  }
}
