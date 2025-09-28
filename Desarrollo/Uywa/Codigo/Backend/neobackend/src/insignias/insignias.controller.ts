import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { InsigniasService } from './insignias.service';
import { CreateInsigniaDto } from './dto/create-insignia.dto';
import { UpdateInsigniaDto } from './dto/update-insignia.dto';

@Controller('insignias')
export class InsigniasController {
  constructor(private readonly insigniasService: InsigniasService) {}

  @Post()
  create(@Body() createInsigniaDto: CreateInsigniaDto) {
    return this.insigniasService.create(createInsigniaDto);
  }

  @Get()
  findAll() {
    return this.insigniasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.insigniasService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateInsigniaDto: UpdateInsigniaDto,
  ) {
    return this.insigniasService.update(+id, updateInsigniaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.insigniasService.remove(+id);
  }
}
