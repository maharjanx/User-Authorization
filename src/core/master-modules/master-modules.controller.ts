import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { MasterModulesService } from "./master-modules.service";
import { CreateMasterModuleDto } from "./dto/create-master-module.dto";
import { UpdateMasterModuleDto } from "./dto/update-master-module.dto";

@Controller("master-modules")
export class MasterModulesController {
  constructor(private readonly masterModulesService: MasterModulesService) {}

  @Post()
  create(@Body() createMasterModuleDto: CreateMasterModuleDto) {
    return this.masterModulesService.createModule(createMasterModuleDto);
  }

  @Get()
  findAll() {
    return this.masterModulesService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.masterModulesService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateMasterModuleDto: UpdateMasterModuleDto
  ) {
    return this.masterModulesService.updateModule(id, updateMasterModuleDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.masterModulesService.deleteModule(id);
  }
}
