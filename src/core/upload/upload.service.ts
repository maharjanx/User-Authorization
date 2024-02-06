import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FileEntity } from "./entity/file.entity";
import { Repository } from "typeorm";
import { unlink } from "fs";
import { resolve } from "path";
import { error } from "console";

@Injectable()
export class MulterService{

    constructor(
        @InjectRepository(FileEntity) private readonly fileRepository: Repository<FileEntity>,
    ){}
    async handleFileUpload(file:any){
        try{
            //Save file information to the database using TypeORM
            const savedFile = await this.saveToFileDatabase(file);

            // Resolve with a success message
            return {message: `File Uploaded Successfully.Saved to database with Id: ${savedFile.id} `}
        }catch(error){
            return "Failed to upload file";
        }
    }

    private async saveToFileDatabase(file: any): Promise<FileEntity>{
        
        //Save file information to the database using TypeOrm
        const savedFile = this.fileRepository.create({
            originalname: file.originalname,
            filename: file.filename,
            path: file.path
        })
        
        return await this.fileRepository.save(savedFile);
    }


    async getAllFiles(){
        return this.fileRepository.find();
    }

    async getFileById(id:number){
        const file = await this.fileRepository.findOne({where:{id}})
        if(!file){
            throw new NotFoundException('File not')
        }
        return file;
    }

    async deleteFileAndRecord(id:number){
        const file = await this.fileRepository.findOne({where:{id}})
        if(file){
           await new Promise<void>((resolve, reject)=>{
            unlink(file.path, (error)=>{
                if(error){
                    reject(error);
                }
                else{
                    resolve();
                }
            })
           })
           
           await this.fileRepository.delete(id);
        

        }
        


    }
}