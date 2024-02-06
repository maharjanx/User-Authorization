import { Module } from "@nestjs/common";
import { InternalAccessService } from "./internal_access.service";
import { InternalAccessController } from "./internal_access.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { InternalAccess } from "./entities/internal_access.entity";
import { Role } from "../role/entities/role.entity";
import { MasterModulePrivilege } from "../master_module_privilege/entities/master_module_privilege.entity";
import { Privilege } from "../privilege/entities/privilege.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      InternalAccess,
      Role,
      MasterModulePrivilege,
      Privilege,
    ]),
  ],
  controllers: [InternalAccessController],
  providers: [InternalAccessService],
})
export class InternalAccessModule {}
