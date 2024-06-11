import { Module } from '@nestjs/common';
import { InsigniasController } from './insignias.controller';
import { InsigniasService } from './insignias.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
    controllers: [InsigniasController],
    providers: [InsigniasService, PrismaService]
})
export class InsigniasModule {

}
