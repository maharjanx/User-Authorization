import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateRoleDto } from "./dto/create-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Role } from "./entities/role.entity";
import { Repository } from "typeorm";

@Injectable()
export class RoleService {
  constructor(@InjectRepository(Role) private roleService: Repository<Role>) {}
  async createRole(createRoleDto: CreateRoleDto) {
    const existingRole = await this.roleService.findOne({
      where: { name: createRoleDto.name },
    });
    if (existingRole) {
      throw new HttpException(
        `This Role ${createRoleDto.name} already exist.`,
        HttpStatus.CONFLICT
      );
    }

    const newRole = this.roleService.create(createRoleDto);
    const savedRole = await this.roleService.save(newRole);
    return { name: savedRole.name, description: savedRole.description };
  }

  findAll() {
    return this.roleService.find();
  }

  async findOne(id: string) {
    const isRole = await this.roleService.findOne({where:{id}});
    return isRole;
  }

  async updateRole(id: string, updateRoleDto: UpdateRoleDto) {
    const isRole = await this.roleService.findOne({ where: { id: id } });
    if (!isRole) {
      throw new HttpException("Role not found to update", HttpStatus.NOT_FOUND);
    }

    const updateRole = await this.roleService.update(id, updateRoleDto);

    return {
      updateRole,
      msg: "the role has been updated",
    };
  }

  
  async removeRole(id: string) {
    const query = `
    SELECT COUNT(*) AS user_count
    FROM user_roles ur
    WHERE "roleId" = $1;`;
    const result = await this.roleService.query(query, [id]);
    const userCount = parseInt(result[0].user_count, 10);
    if(userCount > 0){
      throw new HttpException("Cannot delete role, it is assigned to one or more users",HttpStatus.BAD_REQUEST)

    }

    await this.roleService.delete(id);
  }
}
