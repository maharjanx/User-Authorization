import { IsNotEmpty } from "class-validator";
import { CommonEntity } from "src/core/shared/commonentity/common.entity";
import { Column, Entity } from "typeorm";

@Entity("privilege")
export class Privilege extends CommonEntity {
  @Column({ unique: true })
  @IsNotEmpty()
  name: string;

  @Column({ unique: true })
  @IsNotEmpty()
  short_name: string;

  @Column({ nullable: true })
  privilege_description: string;
}
