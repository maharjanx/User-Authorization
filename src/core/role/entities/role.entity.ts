import { IsNotEmpty, IsString } from "class-validator";
import { CommonEntity } from "src/core/shared/commonentity/common.entity";
import { Column, Entity } from "typeorm";

@Entity({ name: "roles" })
export class Role extends CommonEntity {
  @Column({ unique: true })
  @IsNotEmpty()
  name: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  description: string;
}
