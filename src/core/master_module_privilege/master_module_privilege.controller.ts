import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { MasterModulePrivilegeService } from "./master_module_privilege.service";
import { CreateMasterModulePrivilegeDto } from "./dto/create-master_module_privilege.dto";
import { UpdateMasterModulePrivilegeDto } from "./dto/update-master_module_privilege.dto";

@Controller("master-module-privilege")
export class MasterModulePrivilegeController {
  constructor(
    private readonly masterModulePrivilegeService: MasterModulePrivilegeService
  ) {}

  @Post()
  create(
    @Body() createMasterModulePrivilegeDto: CreateMasterModulePrivilegeDto
  ) {
    return this.masterModulePrivilegeService.create(
      createMasterModulePrivilegeDto
    );
  }

  @Get()
  findAll() {
    return this.masterModulePrivilegeService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.masterModulePrivilegeService.findOne(id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateMasterModulePrivilegeDto: UpdateMasterModulePrivilegeDto
  ) {
    return this.masterModulePrivilegeService.updateMasterModulePrivilegeByModuleId(
      id,
      updateMasterModulePrivilegeDto
    );
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.masterModulePrivilegeService.remove(+id);
  }
}
