import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreatePrivilegeDto } from "./dto/create-privilege.dto";
import { UpdatePrivilegeDto } from "./dto/update-privilege.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Privilege } from "./entities/privilege.entity";
import { Repository } from "typeorm";
import { error } from "console";

@Injectable()
export class PrivilegeService {
  constructor(
    @InjectRepository(Privilege) private privilegeService: Repository<Privilege>
  ) {}

  async createprivilege(createPrivilegeDto: CreatePrivilegeDto) {
    try {
      const existPrivilege = await this.privilegeService.findOne({
        where: {
          name: createPrivilegeDto.name,
          short_name: createPrivilegeDto.short_name,
        },
      });
      if (existPrivilege) {
        throw new HttpException(
          "The privilege already exists",
          HttpStatus.CONFLICT
        );
      }
      const newPrivilege = this.privilegeService.create(createPrivilegeDto);
      return await this.privilegeService.save(newPrivilege);
    } catch (error) {
      console.error(error);
      throw new HttpException(
        "Internal Server Error",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  findAll() {
    return this.privilegeService.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} privilege`;
  }

  async updatePrivilege(id: string, updatePrivilegeDto: UpdatePrivilegeDto) {
    try {
      const existPrivilege = await this.privilegeService.findOne({
        where: { id: id },
      });
      if (!existPrivilege) {
        throw new HttpException(
          `privilege with id ${id} not found`,
          HttpStatus.NOT_FOUND
        );
      }
      return await this.privilegeService.update(id, updatePrivilegeDto);
    } catch (error) {
      console.error(error);
      throw new HttpException(
        "Internal Server Error",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async remove(id: string) {
    const query = `SELECT COUNT(*) as privilege_count
    from master_module_privilege as mmp
    where mmp."privilegeId" = $1`

    const result = await this.privilegeService.query(query, [id]);
    const privilegeCount = parseInt(result[0].privilege_count,10);
    if(privilegeCount>0){
      throw new HttpException("Cannot delete Privilege, it is assigned to one or more modules",HttpStatus.BAD_REQUEST)
    }

    return await this.privilegeService.delete(id);
  }
}
