import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AnimalService } from './animal.service';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { UpdateAnimalDto } from './dto/update-animal.dto';
import { ApiTags, ApiConsumes } from '@nestjs/swagger';
import { UploadMiddleware } from 'src/upload.middleware';

@ApiTags('animal')
@Controller('animal')
export class AnimalController {
  constructor(private readonly animalService: AnimalService) {}

  // Para crear - IGUAL QUE EN REPORTES
  @UseInterceptors(
    FileInterceptor('imagen_url', UploadMiddleware.getMulterOptions()), // ✅ Usar 'imagen_url' igual
  )
  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(
    @Body() createAnimalDto: CreateAnimalDto,
    @UploadedFile() file?: Express.Multer.File, // ✅ Opcional como en reportes
  ) {
    return this.animalService.create(createAnimalDto, file);
  }

  @Get()
  findAll() {
    return this.animalService.findAll();
  }

  @Get('/list')
  listAll() {
    return this.animalService.listAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.animalService.findOne(+id);
  }

  // Para actualizar - IGUAL QUE EN REPORTES
  @UseInterceptors(
    FileInterceptor('imagen_url', UploadMiddleware.getMulterOptions()), // ✅ Usar 'imagen_url' igual
  )
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAnimalDto: UpdateAnimalDto,
    @UploadedFile() file?: Express.Multer.File, // ✅ Opcional como en reportes
  ) {
    return this.animalService.update(+id, updateAnimalDto, file);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.animalService.remove(+id);
  }
}
