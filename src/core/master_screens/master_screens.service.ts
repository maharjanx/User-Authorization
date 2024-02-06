import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateMasterScreenDto } from "./dto/create-master_screen.dto";
import { UpdateMasterScreenDto } from "./dto/update-master_screen.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { MasterScreen } from "./entities/master_screen.entity";
import { Repository } from "typeorm";
import { MasterModule } from "../master-modules/entities/master-module.entity";
import { MasterModulePrivilege } from "../master_module_privilege/entities/master_module_privilege.entity";
import { error } from "console";

@Injectable()
export class MasterScreensService {
  constructor(
    @InjectRepository(MasterScreen)
    private masterScreensService: Repository<MasterScreen>,
    @InjectRepository(MasterModule)
    private masterModuleService: Repository<MasterModule>,
    @InjectRepository(MasterModulePrivilege)
    private masterMoudlePrivilegeService: Repository<MasterModulePrivilege>
  ) {}
  async createScreen(createMasterScreenDto: CreateMasterScreenDto) {
    try {
      const existScreen = await this.masterScreensService.findOne({
        where: { name: createMasterScreenDto.name },
      });
      if (existScreen) {
        throw new HttpException("Screen already exist!!!", HttpStatus.CONFLICT);
      }

      const newScreen = this.masterScreensService.create(createMasterScreenDto);

      const saveScreen = await this.masterScreensService.save(newScreen);
      return {
        id: saveScreen.id,
        name: saveScreen.name,
        description: saveScreen.description,
      };
    } catch (error) {
      console.error(error);
      throw new HttpException(
        "Internal Server Error",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  findAll() {
    return this.masterScreensService.find();
  }

  async findOneByScreenId(roleId: string,screenId:string) {
    const getModulesFromScreen = await this.masterMoudlePrivilegeService.query(`WITH temp AS (
      SELECT 
          p."name",
          mmp."masterModuleId" AS "moduleId",
          JSON_AGG(
              JSON_BUILD_OBJECT(
                  'modulePriviligeId', mmp.id,
                  'priviligeId', p.id,
                  'url', mmp.url,
                  'method', mmp.method,
        'isActive',case when ia."is_active" is null  then false else ia."is_active" end
              )
          ) AS details 
      FROM 
          master_module_privilege mmp
       left join internal_access ia ON ia."masterModulePrivilegeId" = mmp.id and ia."roleId"=$1
      INNER JOIN privilege p ON p.id = mmp."privilegeId"
      GROUP BY 1, 2
  ),
  temps AS (
      SELECT 
          t."moduleId",
          mm."name",
          JSON_AGG(
              JSON_BUILD_OBJECT(
                  'details', t.details,
                  'name', t.name
              )
          ) AS privileges 
      FROM 
          temp t 
      INNER JOIN master_modules mm ON mm.id = t."moduleId"
      GROUP BY 1, 2
  )
  SELECT 
      ms.name AS "screenName",
      JSON_AGG(t.*)  as details
  FROM 
      temps t
  INNER JOIN master_modules mm ON mm.id = t."moduleId"
  INNER JOIN master_screen ms ON ms.id = mm.master_screen_id
  WHERE 
      mm.master_screen_id = $2
  GROUP BY 1`,
      [roleId,screenId]
    );
    return getModulesFromScreen?.[0];
  }

  async updateScreen(id: string, updateMasterScreenDto: UpdateMasterScreenDto) {
    try {
      const existScreen = await this.masterScreensService.findOne({
        where: { id },
      });
      if (!existScreen) {
        throw new HttpException("Screen Not found", HttpStatus.NOT_FOUND);
      }

      return this.masterScreensService.update(id, updateMasterScreenDto);
    } catch (error) {
      console.error(error);
      throw new HttpException(
        "Internal Server Error",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async remove(id: string) {

    const query = `SELECT COUNT(*) as screen_count
    from master_modules as mm
    where mm.master_screen_id=$1;`

    const result = await this.masterModuleService.query(query, [id]);
    const screenCount = parseInt(result[0].screen_count, 10);
    if(screenCount>0){
      throw new HttpException("Cannot delete the screen, it is assigned to another modules", HttpStatus.BAD_REQUEST);
    }

    return this.masterScreensService.delete(id)
  }
   
}
