import { Module } from "@nestjs/common";
import { MasterModulePrivilegeService } from "./master_module_privilege.service";
import { MasterModulePrivilegeController } from "./master_module_privilege.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MasterModulePrivilege } from "./entities/master_module_privilege.entity";
import { MasterModule } from "../master-modules/entities/master-module.entity";
import { Privilege } from "../privilege/entities/privilege.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([MasterModulePrivilege, MasterModule, Privilege]),
  ],
  controllers: [MasterModulePrivilegeController],
  providers: [MasterModulePrivilegeService],
})
export class MasterModulePrivilegeModule {}
