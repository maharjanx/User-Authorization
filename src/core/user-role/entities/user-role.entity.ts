import { Role } from "src/core/role/entities/role.entity";
import { CommonEntity } from "src/core/shared/commonentity/common.entity";
import { User } from "src/core/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
@Entity("user_roles")
export class UserRole extends CommonEntity {
  @Column()
  userId: string;

  @Column()
  roleId: string;

  @ManyToOne(() => User)
  @JoinColumn({
    foreignKeyConstraintName: "userId",
    referencedColumnName: "id",
  })
  user: User;

  @ManyToOne(() => Role)
  @JoinColumn({
    foreignKeyConstraintName: "roleId",
    referencedColumnName: "id",
  })
  role: Role;
}
