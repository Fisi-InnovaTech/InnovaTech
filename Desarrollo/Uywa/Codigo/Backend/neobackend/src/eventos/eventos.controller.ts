// src/eventos/eventos.controller.ts
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
import { EventosService } from './eventos.service';
import { CreateEventoDto } from './dto/create-evento.dto';
import { UpdateEventoDto } from './dto/update-evento.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadMiddleware } from 'src/upload.middleware';

@Controller('eventos')
export class EventosController {
  constructor(private readonly eventosService: EventosService) {}

  @UseInterceptors(
    FileInterceptor('imagen_url', UploadMiddleware.getMulterOptions()),
  )
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() createEventoDto: CreateEventoDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.eventosService.create(createEventoDto, file);
  }

  @Get()
  findAll(@Query('usuarioId') usuarioId?: string) {
    if (usuarioId) {
      return this.eventosService.findByUsuario(Number(usuarioId));
    }
    return this.eventosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.eventosService.findOne(id);
  }

  @UseInterceptors(
    FileInterceptor('imagen_url', UploadMiddleware.getMulterOptions()),
  )
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEventoDto: UpdateEventoDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.eventosService.update(id, updateEventoDto, file);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.eventosService.remove(id);
  }
}
