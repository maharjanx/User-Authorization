import { MasterModule } from "src/core/master-modules/entities/master-module.entity";
import { Privilege } from "src/core/privilege/entities/privilege.entity";
import { CommonEntity } from "src/core/shared/commonentity/common.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

@Entity("master_module_privilege")
export class MasterModulePrivilege extends CommonEntity {
  @Column()
  masterModuleId: string;

  @Column()
  privilegeId: string;

  @ManyToOne(() => MasterModule)
  @JoinColumn({
    foreignKeyConstraintName: "masterModuleId",
    referencedColumnName: "id",
  })
  masterModule: MasterModule;

  @ManyToOne(() => Privilege)
  @JoinColumn({
    foreignKeyConstraintName: "privilegeId",
    referencedColumnName: "id",
  })
  privilege: Privilege;

  @Column()
  url: string;

  @Column()
  method: string;
}
