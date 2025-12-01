import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AnimalService } from './animal.service';
import { AnimalController } from './animal.controller';

@Module({
  controllers: [AnimalController],
  providers: [AnimalService, PrismaService],
})
export class AnimalModule {}
