import { PartialType } from "@nestjs/swagger";
import { CreateInternalAccessDto } from "./create-internal_access.dto";
import { IsNotEmpty, IsString } from "class-validator";

export class UpdateInternalAccessDto {
  @IsString()
  @IsNotEmpty()
  roleid: string;

  @IsString()
  @IsNotEmpty()
  moduleId: string;

  
}
