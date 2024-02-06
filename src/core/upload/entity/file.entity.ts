import { Column, Entity, JoinColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity('files')
export class FileEntity{
        @PrimaryGeneratedColumn()
        id: number;

        @Column()
        originalname: string;

        @Column()
        filename:string;

        @Column()
        path: string;

        @Column({nullable: true})
        mimetype: string;

        
    
}
