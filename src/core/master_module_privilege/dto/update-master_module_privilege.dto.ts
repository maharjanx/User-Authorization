import { PartialType } from "@nestjs/swagger";
import {
  CreateMasterModulePrivilegeDto,
  Method,
} from "./create-master_module_privilege.dto";
import { IsArray, IsNotEmpty } from "class-validator";

export class UpdateMasterModulePrivilegeDto extends PartialType(
  CreateMasterModulePrivilegeDto
) {
  @IsNotEmpty()
  @IsArray()
  privileges: {
    id: string;
    privilegeId: string;
    method: Method;
    url: string;
  }[];
}
