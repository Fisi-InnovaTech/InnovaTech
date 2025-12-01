import { PartialType } from '@nestjs/swagger';
import { CreateAnimalDto } from './create-animal.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateAnimalDto extends PartialType(CreateAnimalDto) {
  @IsOptional()
  @IsString()
  imagen_url?: string; // Ahora será string (URL de S3) en updates
}
