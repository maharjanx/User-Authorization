
import { CommonEntity } from "src/core/shared/commonentity/common.entity";
import { FileEntity } from "src/core/upload/entity/file.entity";
import { Column, Entity, JoinColumn, OneToOne } from "typeorm";

@Entity({ name: "users" })
export class User extends CommonEntity {
  @Column({ length: 100 })
  full_name: string;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ nullable: true, length: 20 })
  phone: string;

  @Column({ nullable: true, length: 255 })
  address: string;

  @Column({ unique: true, length: 10 })
  emp_code: string;

  @Column({ select: false })
  password: string;

  @Column({ select: false, nullable: true })
  password_change: string;

  @Column({ select: false })
  salt: string;

  // @OneToOne(()=>FileEntity)
  // @JoinColumn({referencedColumnName:'id'})
  // file_id:number
    @Column({default:null})
    file:string

  //   @BeforeInsert()
  //   async hashPassword() {
  //     console.log(this);
  //   }
}
