import { Module } from "@nestjs/common";
import { MasterModulesService } from "./master-modules.service";
import { MasterModulesController } from "./master-modules.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MasterModule } from "./entities/master-module.entity";

@Module({
  imports: [TypeOrmModule.forFeature([MasterModule])],
  controllers: [MasterModulesController],
  providers: [MasterModulesService],
})
export class MasterModulesModule {}
