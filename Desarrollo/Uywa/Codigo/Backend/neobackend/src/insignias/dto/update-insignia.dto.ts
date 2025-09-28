import { PartialType } from '@nestjs/mapped-types';
import { CreateInsigniaDto } from './create-insignia.dto';

export class UpdateInsigniaDto extends PartialType(CreateInsigniaDto) {}
