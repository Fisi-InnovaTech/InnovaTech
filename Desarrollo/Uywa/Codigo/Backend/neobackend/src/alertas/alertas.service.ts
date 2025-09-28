import { Injectable } from '@nestjs/common';
import { CreateAlertaDto } from './dto/create-alerta.dto';
import { UpdateAlertaDto } from './dto/update-alerta.dto';

@Injectable()
export class AlertasService {
  create(createAlertaDto: CreateAlertaDto) {
    return 'This action adds a new alerta';
  }

  findAll() {
    return `This action returns all alertas`;
  }

  findOne(id: number) {
    return `This action returns a #${id} alerta`;
  }

  update(id: number, updateAlertaDto: UpdateAlertaDto) {
    return `This action updates a #${id} alerta`;
  }

  remove(id: number) {
    return `This action removes a #${id} alerta`;
  }
}
