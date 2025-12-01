import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AnimalService } from './animal.service';
import { AnimalController } from './animal.controller';
import { S3Service } from 'src/aws/s3.service';

@Module({
  controllers: [AnimalController],
  providers: [AnimalService, PrismaService, S3Service],
})
export class AnimalModule {}
