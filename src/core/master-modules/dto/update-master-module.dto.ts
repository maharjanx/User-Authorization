import { PartialType } from '@nestjs/swagger';
import { CreateMasterModuleDto } from './create-master-module.dto';

export class UpdateMasterModuleDto extends PartialType(CreateMasterModuleDto) {}
