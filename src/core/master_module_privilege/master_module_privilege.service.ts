import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateMasterModulePrivilegeDto } from "./dto/create-master_module_privilege.dto";
import { UpdateMasterModulePrivilegeDto } from "./dto/update-master_module_privilege.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { MasterModulePrivilege } from "./entities/master_module_privilege.entity";
import { Repository } from "typeorm";
import { MasterModule } from "../master-modules/entities/master-module.entity";
import { Privilege } from "../privilege/entities/privilege.entity";

@Injectable()
export class MasterModulePrivilegeService {
  constructor(
    @InjectRepository(MasterModulePrivilege)
    private masterModulePrivilegeService: Repository<MasterModulePrivilege>,
    @InjectRepository(MasterModule)
    private masterModuleService: Repository<MasterModule>,
    @InjectRepository(Privilege) private privilegeService: Repository<Privilege>
  ) {}
  async create(createMasterModulePrivilegeDto: CreateMasterModulePrivilegeDto) {
    return await this.masterModulePrivilegeService.manager.transaction((t) => {
      try {
        return this.masterModulePrivilegeService.manager.transaction(
          async (t) => {
            const ext = await this.masterModuleService.query(
              `select case when count(m.*)>0 then true else false end from master_modules m
          where  m."name" = $1 or m.short_name= $2;
          `,
              [
                createMasterModulePrivilegeDto.moduleName,
                createMasterModulePrivilegeDto.moduleShortName,
              ] 
            );
            if (ext?.[0]?.case) {
              throw new HttpException(
                "Module already exist",
                HttpStatus.CONFLICT
              );
            }

            // saving module
            const newModule = this.masterModuleService.create({
              master_screen_id: createMasterModulePrivilegeDto.master_screen_id,
              module_description: createMasterModulePrivilegeDto.description,
              short_name: createMasterModulePrivilegeDto.moduleShortName,
              name: createMasterModulePrivilegeDto.moduleName,
            });
            const module = await t.save(MasterModule, newModule);
            /// saving module_previleges
            for (let prv of createMasterModulePrivilegeDto.privileges) {
              const modulePrv = this.masterModulePrivilegeService.create({
                privilegeId: prv.privilegeId,
                url: prv.url,
                method: prv.method,
                masterModuleId: module?.id,
              });
              await t.save(MasterModulePrivilege, modulePrv);
            }

            return true;
          }
        );
      } catch (error) {
        console.error("Internal server Error", error);
        throw new HttpException(
          "Internal Server Error",
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    });
  }

  async findAll() {
    const fetchModule = await this.masterModulePrivilegeService.manager
      .query(`

      with temp as (SELECT 
        mm.id as "masterModuleId",
        mm.name as "masterModuleName",
        mm.short_name as "masterModuleShortName",
        mm.module_description as "masterModuleDescription",
        mm.master_screen_id as "masterScreenId",
        ms.name as "masterScreenName",
        mmp."privilegeId",
        json_agg(
          json_build_object(
            'endpoint', mmp.url,
            'method', mmp.method
          )
        ) as privileges
      FROM 
        master_modules mm
      LEFT JOIN
        master_screen ms ON ms.id = mm.master_screen_id
      LEFT JOIN 
        master_module_privilege mmp ON mmp."masterModuleId" = mm.id
      LEFT JOIN 
        privilege pv ON pv.id = mmp."privilegeId"
      GROUP BY 
        1,2,3,4,5,6 ,mmp."privilegeId" )
        
       select 
      t. "masterModuleId",
       t."masterModuleName",
       t."masterModuleShortName",
       t."masterModuleDescription",
       t."masterScreenId",
       t."masterScreenName",
       json_agg(
       json_build_object('priviliges',"privileges",'previligeId',"privilegeId",'name',p.name)
       ) as "privligeDetails" from temp t
       inner join privilege p on t."privilegeId"=p.id
       group by 1,2,3,4,5,6 ;
      
  `);

    return fetchModule;
  }

  async findOne(id: string) {
    try {
      const existModule = await this.masterModuleService?.findOne({
        where: { id },
      });
      if (!existModule) {
        throw new HttpException(
          `Module With id ${id} doesnot exist`,
          HttpStatus.NOT_FOUND
        );
      }
      return await (this.masterModulePrivilegeService.query(
        `SELECT 
      mm.id as "masterModuleId",
      mm.name as "masterModuleName",
      mm.short_name as "masterModuleShortName",
      mm.module_description as "masterModuleDescription",
      mm.master_screen_id as "masterScreenId",
      ms.name as "masterScreenName",
      mm.module_description as "description",
      json_agg(
        json_build_object(
          'privilegeName', pv.name,
          'privilegeId', pv.id,
          'url', mmp.url,
          'method', mmp.method,
          'masterModulePriviligeId',mmp.id
        )
      ) as privileges
    FROM 
      master_modules mm
    LEFT JOIN
      master_screen ms ON ms.id = mm.master_screen_id
    LEFT JOIN 
      master_module_privilege mmp ON mmp."masterModuleId" = mm.id
    LEFT JOIN 
      privilege pv ON pv.id = mmp."privilegeId"
    WHERE mm.id = $1
    GROUP BY 
      1,2,3,4,5,6;
    `,
        [id]
      ));
    } catch (error) {
      console.log("Internal server error", error);
      throw new HttpException(
        "Internal server error",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updateMasterModulePrivilegeByModuleId(
    id: string,
    updateMasterModulePrivilegeDto: UpdateMasterModulePrivilegeDto
  ) {
    return await this.masterModulePrivilegeService.manager.transaction(
      async (t) => {
        try {
          //find module form database
          const existModule = await this.masterModuleService.findOne({
            where: { id: id },
          });
          if (!existModule) {
            throw new HttpException("Module not found ", HttpStatus.NOT_FOUND);
          }
          //updating module
          existModule.name = updateMasterModulePrivilegeDto.moduleName;
          existModule.master_screen_id =
            updateMasterModulePrivilegeDto.master_screen_id;
          existModule.module_description =
            updateMasterModulePrivilegeDto.description;
          existModule.short_name =
            updateMasterModulePrivilegeDto.moduleShortName;
          await t.save(MasterModule, existModule);
          //extract old updatable previliges and new previliges
          const { privileges } = updateMasterModulePrivilegeDto;

          //find all the old previliges saved in database under module id
          const alreadyExistingModulePrivilege = await this.masterModulePrivilegeService.find(
            {
              where: { masterModuleId: id },
            }
          );

          // sepereate fresh new previlidge whose previlegesId is null
          const newModeulePrivilege = privileges?.filter((f) => !f.id);

          //saving fresh new previlidge
          for (let prev of newModeulePrivilege) {
            const prevliege = this.masterModulePrivilegeService.create({
              masterModuleId: id,
              privilegeId: prev.privilegeId,
              url: prev.url,
              method: prev.method,
            });

            await t.save(MasterModulePrivilege, prevliege);
          }

          //seperate updateable previledge
          const restPrivilege = privileges?.filter((f) => f.id);

          //finding deletebale previlidge which is present in databse and absent in update payload
          const deleteAblePrivilege = alreadyExistingModulePrivilege.filter(
            (f) => !restPrivilege.map((r) => r.id).includes(f.id)
          );
          //presisting deleteable previlidge
          for (let deltab of deleteAblePrivilege) {
            await t.remove(MasterModulePrivilege, deltab);
          }

          // updating previlidge which is already saved
          for (let updateblePrev of restPrivilege) {
            await t.update(
              MasterModulePrivilege,
              {
                id: updateblePrev.id,
              },
              updateblePrev
            );
          }
          return true;
        } catch (error) {
          console.error(error);
          throw new HttpException(
            "Internal Server error",
            HttpStatus.INTERNAL_SERVER_ERROR
          );
        }
      }
    );
  }

  remove(id: number) {
    return `This action removes a #${id} masterModulePrivilege`;
  }
}
