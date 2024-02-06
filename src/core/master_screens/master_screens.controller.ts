import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { MasterScreensService } from "./master_screens.service";
import { CreateMasterScreenDto } from "./dto/create-master_screen.dto";
import { UpdateMasterScreenDto } from "./dto/update-master_screen.dto";

@Controller("master-screens")
export class MasterScreensController {
  constructor(private readonly masterScreensService: MasterScreensService) {}

  @Post()
  create(@Body() createMasterScreenDto: CreateMasterScreenDto) {
    return this.masterScreensService.createScreen(createMasterScreenDto);
  }

  @Get()
  findAll() {
    return this.masterScreensService.findAll();
  }

  @Get(":screenId/:roleId")
  findOneByScreenId(@Param("screenId")screenId: string,@Param("roleId")roleId: string) {
    return this.masterScreensService.findOneByScreenId(roleId,screenId);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateMasterScreenDto: UpdateMasterScreenDto
  ) {
    return this.masterScreensService.updateScreen(id, updateMasterScreenDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.masterScreensService.remove(id);
  }
}
