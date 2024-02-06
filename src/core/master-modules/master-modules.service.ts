import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateMasterModuleDto } from "./dto/create-master-module.dto";
import { UpdateMasterModuleDto } from "./dto/update-master-module.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { MasterModule } from "./entities/master-module.entity";
import { Repository } from "typeorm";
import e from "express";

@Injectable()
export class MasterModulesService {
  constructor(
    @InjectRepository(MasterModule)
    private masterModuleService: Repository<MasterModule>
  ) {}
  async createModule(createMasterModuleDto: CreateMasterModuleDto) {
    try {
      const existModule = await this.masterModuleService.findOne({
        where: { name: createMasterModuleDto.name },
      });

      if (existModule) {
        throw new HttpException(
          "The module already exist",
          HttpStatus.CONFLICT
        );
      }

      const newModule = this.masterModuleService.create(createMasterModuleDto);
      const createModule = await this.masterModuleService.save(newModule);
      return {
        name: createModule.name,
        description: createModule.module_description,
      };
    } catch (error) {
      console.error("Internal Server Error", error);
      throw new HttpException(
        "Internal Server Error",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  findAll() {
    return `This action returns all masterModules`;
  }

  findOne(id: number) {
    return `This action returns a #${id} masterModule`;
  }

  async updateModule(id: string, updateMasterModuleDto: UpdateMasterModuleDto) {
    try {
      const existModule = await this.masterModuleService.findOne({
        where: { id },
      });

      if (!existModule) {
        throw new HttpException(
          `Module with id ${id} not found`,
          HttpStatus.NOT_FOUND
        );
      }
      const updateModule = await this.masterModuleService.update(
        id,
        updateMasterModuleDto
      );
      return { updateModule, msg: "module updated successfully" };
    } catch (error) {
      console.error(error);
      throw new HttpException(
        "Internal Server Error",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  deleteModule(id: string) {
    this.masterModuleService.delete(id);
    return { msg: "Module deleted successfully" };
  }
}
