import { IsNotEmpty } from "class-validator";
import { MasterScreen } from "src/core/master_screens/entities/master_screen.entity";
import { CommonEntity } from "src/core/shared/commonentity/common.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";

@Entity("master_modules")
export class MasterModule extends CommonEntity {
  @Column({ unique: true })
  @IsNotEmpty()
  name: string;

  @Column({ unique: true })
  @IsNotEmpty()
  short_name: string;

  @Column()
  module_description: string;

  @ManyToOne(() => MasterScreen)
  @JoinColumn({ name: "master_screen_id" })
  master_screen_id: string;
}
