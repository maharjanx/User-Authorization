import { PartialType } from '@nestjs/swagger';
import { CreateMasterScreenDto } from './create-master_screen.dto';

export class UpdateMasterScreenDto extends PartialType(CreateMasterScreenDto) {}
