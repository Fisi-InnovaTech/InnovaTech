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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ReportesService } from './reportes.service';
import { FindOneReporteDto } from './dto/find.one-reporte.dto';
import { CreateReporteDto } from './dto/create-reporte.dto';
import { UpdateReporteDto } from './dto/update-reporte.dto';
import { UploadMiddleware } from 'src/upload.middleware';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('reportes')
export class ReportesController {
  constructor(private readonly reportesService: ReportesService) {}

  @UseInterceptors(
    FileInterceptor('evidencia_imagen', UploadMiddleware.getMulterOptions()),
  )
  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(
    @Body() createReporteDto: CreateReporteDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.reportesService.create(createReporteDto, file);
  }
  
  @Get('estado/:estado')
  getReporteByEstado(@Param('estado') estado: string) {
    return this.reportesService.findByEstado(estado);
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
  findOne(@Param() params: FindOneReporteDto) {
    return this.reportesService.findOne(params.id);
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('evidencia_imagen', UploadMiddleware.getMulterOptions()),
  )
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateReporteDto: UpdateReporteDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.reportesService.update(id, updateReporteDto, file);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.reportesService.remove(id);
  }
}
