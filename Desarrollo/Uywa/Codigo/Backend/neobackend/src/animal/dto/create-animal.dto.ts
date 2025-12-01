import { IsNotEmpty, IsOptional, IsString, Matches, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAnimalDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  nombre: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  habitad: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  estado: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  imagen_url: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  video_url?: string;
}