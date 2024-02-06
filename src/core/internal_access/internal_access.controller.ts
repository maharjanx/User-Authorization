import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { InternalAccessService } from "./internal_access.service";
import { CreateInternalAccessDto } from "./dto/create-internal_access.dto";
import { UpdateInternalAccessDto } from "./dto/update-internal_access.dto";

@Controller("internal-access")
export class InternalAccessController {
  constructor(private readonly internalAccessService: InternalAccessService) {}

  @Post()
  create(@Body() createInternalAccessDto: CreateInternalAccessDto) {
    return this.internalAccessService.create(createInternalAccessDto);
  }

  @Get()
  findAll() {
    return this.internalAccessService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.internalAccessService.findOne(id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateInternalAccessDto: UpdateInternalAccessDto
  ) {
    return this.internalAccessService.update(id, updateInternalAccessDto);
  }

  @Get("/:roleId/:screenId ")
  findByScreenIdAndRoleId(@Param("screenId") screenId: string, @Param("roleId") roleId: string) {
    return this.internalAccessService.findByScreenIdAndRoleId(screenId, roleId);
  }
}
