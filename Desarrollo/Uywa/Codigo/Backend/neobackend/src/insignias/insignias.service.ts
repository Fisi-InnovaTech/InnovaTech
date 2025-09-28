import { Injectable } from '@nestjs/common';
import { CreateInsigniaDto } from './dto/create-insignia.dto';
import { UpdateInsigniaDto } from './dto/update-insignia.dto';

@Injectable()
export class InsigniasService {
  create(createInsigniaDto: CreateInsigniaDto) {
    return 'This action adds a new insignia';
  }

  findAll() {
    return `This action returns all insignias`;
  }

  findOne(id: number) {
    return `This action returns a #${id} insignia`;
  }

  update(id: number, updateInsigniaDto: UpdateInsigniaDto) {
    return `This action updates a #${id} insignia`;
  }

  remove(id: number) {
    return `This action removes a #${id} insignia`;
  }
}
