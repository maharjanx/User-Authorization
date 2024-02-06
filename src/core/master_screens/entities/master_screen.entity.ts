import { IsNotEmpty } from "class-validator";
import { MasterModule } from "src/core/master-modules/entities/master-module.entity";
import { CommonEntity } from "src/core/shared/commonentity/common.entity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";

@Entity("master_screen")
export class MasterScreen extends CommonEntity {
  @Column({ unique: true })
  @IsNotEmpty()
  name: string;

  @Column()
  description: string;
}
