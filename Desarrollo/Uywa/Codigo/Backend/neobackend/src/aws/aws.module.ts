import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { S3Service } from './s3.service';

@Module({
  imports: [ConfigModule], // ✅ Importar ConfigModule aquí
  providers: [S3Service],
  exports: [S3Service], // ✅ Exportar S3Service para que otros módulos lo usen
})
export class AwsModule {}
