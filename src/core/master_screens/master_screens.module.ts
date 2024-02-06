import { Module } from "@nestjs/common";
import { MasterScreensService } from "./master_screens.service";
import { MasterScreensController } from "./master_screens.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MasterScreen } from "./entities/master_screen.entity";
import { MasterModule } from "../master-modules/entities/master-module.entity";
import { MasterModulePrivilege } from "../master_module_privilege/entities/master_module_privilege.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MasterScreen,
      MasterModule,
      MasterModulePrivilege,
    ]),
  ],
  controllers: [MasterScreensController],
  providers: [MasterScreensService],
})
export class MasterScreensModule {}
