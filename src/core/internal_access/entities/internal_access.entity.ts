import { MasterModulePrivilege } from "src/core/master_module_privilege/entities/master_module_privilege.entity";
import { Role } from "src/core/role/entities/role.entity";
import { CommonEntity } from "src/core/shared/commonentity/common.entity";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne } from "typeorm";

@Entity("internal_access")
export class InternalAccess extends CommonEntity {
  @Column()
  masterModulePrivilegeId: string;

  @Column()
  roleId: string;

  @ManyToOne(() => MasterModulePrivilege)
  @JoinColumn({
    foreignKeyConstraintName: "masterModulePrivilegeId",
    referencedColumnName: "id",
  })
  masterModulePrivilege: MasterModulePrivilege;

  @ManyToOne(() => Role)
  @JoinColumn({
    foreignKeyConstraintName: "roleId",
    referencedColumnName: "id",
  })
  role: Role;
}
