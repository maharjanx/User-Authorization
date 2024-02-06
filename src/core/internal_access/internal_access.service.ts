import { Injectable } from "@nestjs/common";
import {
  Action,
  CreateInternalAccessDto,
} from "./dto/create-internal_access.dto";
import { UpdateInternalAccessDto } from "./dto/update-internal_access.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { InternalAccess } from "./entities/internal_access.entity";
import { Repository } from "typeorm";
import { MasterModulePrivilege } from "../master_module_privilege/entities/master_module_privilege.entity";

@Injectable()
export class InternalAccessService {
  constructor(
    @InjectRepository(InternalAccess)
    private internalAccessService: Repository<InternalAccess>,

    @InjectRepository(MasterModulePrivilege)
    private masterModulePrivilegeService: Repository<MasterModulePrivilege>
  ) {}
  async create(createInternalAccessDto: CreateInternalAccessDto) {

    return this.internalAccessService.manager.transaction(async (t)=>{

      const existModulePrivilege = await this.masterModulePrivilegeService.find({where:{masterModuleId:createInternalAccessDto.moduleId, privilegeId:createInternalAccessDto.privilegeId}})
      
      
      for(let emp of  existModulePrivilege){
        
        // const findAlredyExtinAcc
        const alreadyExistingInternalAccess = await this.internalAccessService.findOne({where:{roleId:createInternalAccessDto.roleId, masterModulePrivilegeId:emp.id}})
        if(createInternalAccessDto.action==Action.CREATE){
          if(alreadyExistingInternalAccess){
           
        await this.internalAccessService.update( {id:alreadyExistingInternalAccess.id},{is_active:true})
          }else{
            const access= this.internalAccessService.create({
              masterModulePrivilegeId:emp.id,
              roleId:createInternalAccessDto.roleId
            })
            await this.internalAccessService.save(access)
          }
        }else if(createInternalAccessDto.action==Action.DELETE){
          alreadyExistingInternalAccess.id && await  this.internalAccessService.update( {id:alreadyExistingInternalAccess.id},{is_active:false})
        }
     
      }
return true;
    })
    
  }

  findAll() {
    return `This action returns all internalAccess`;
  }

  async findOne(roleId: string) {
    const activeScreenList = await this.
    internalAccessService.query(`select distinct ms.id, ms."name" from internal_access ia
    inner join master_module_privilege mmp ON mmp.id = ia."masterModulePrivilegeId"
    inner join master_modules mm on mm.id = mmp."masterModuleId"
    inner join master_screen ms on ms.id = mm.master_screen_id
    where ia.is_active=true and ia."roleId"=$1`,[roleId])

    return activeScreenList;
  }

  async update(id: string, updateInternalAccessDto: UpdateInternalAccessDto) {
    const checkAccess = await this.internalAccessService.query(
      `select ia.id
    from 
    internal_access ia
    left join
    master_module_privilege mmp on mmp.id = ia."masterModulePrivilegeId"
    left join 
    master_modules mm ON mm.id = mmp."masterModuleId"
    where 
     ia."roleId" = $1 AND mm."id" = $2`,
      [updateInternalAccessDto.roleid, updateInternalAccessDto.moduleId]
    );

    if (checkAccess?.[0]) {
      const internalIdArray: [] = checkAccess?.map((m) => m.id);
      await this.internalAccessService.query(
        `update internal_access set is_active=false where id in ($1)`,
        [internalIdArray.join()]
      );
    }
    return true;
  }

  async findByScreenIdAndRoleId(roleId: string, screenId: string) {

    const query = `

    update
     internal_access set is_active = false where id in (
     select distinct ia.id from internal_access ia
    inner join 
    master_module_privilege mmp ON mmp.id = ia."masterModulePrivilegeId"
    inner join
    master_modules mm on mm.id = mmp."masterModuleId"
    inner join 
    master_screen ms ON ms.id = mm.master_screen_id
    where 
    ia.is_active=true and
    ia."roleId"= $1 and mm.master_screen_id = $2
     )`

     const removeActiveScreenList = await this.internalAccessService.query(query,[roleId, screenId])
     return removeActiveScreenList;
  }
}
