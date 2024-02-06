import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { UserRole } from "../user-role/entities/user-role.entity";
import { Role } from "../role/entities/role.entity";
import { MulterModule } from "../multer/multer.module";
import { BadRequestException } from "@nestjs/common";
import { MulterModule as NestMulterModule } from "@nestjs/platform-express";
import {diskStorage} from 'multer'
import { FileEntity } from "../upload/entity/file.entity";
import * as mime from 'mime-types';
import { MulterService } from "../upload/upload.service";

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png']; //Define the allowed MIME types
const MAX_FILE_SIZE =1024*1024*5 // 5MB

@Module({
  imports: [TypeOrmModule.forFeature([User, UserRole, Role, MulterModule, FileEntity ]),
  NestMulterModule.registerAsync({
    useFactory:()=>({
        storage: diskStorage({
            destination:'./uploads/user_photos',
            filename: (req,file, cb)=>{
                const uniqueSuffix= `${Date.now()}-${Math.round(Math.random() * 1e9)}`
                const extension = mime.extension(file.mimetype)
                cb(null, `user_photo_${uniqueSuffix}.${extension}`);
            },
        }),

        fileFilter:(req, file, cb)=>{
            //valiate file type
            if(!ALLOWED_MIME_TYPES.includes(file.mimetype)){
                return cb(new BadRequestException('Invalid file type'), false);
            }

            //Validate file size
            if(file.size > MAX_FILE_SIZE){
                return cb (new BadRequestException('File size exceeds the limit'), false)
            }

            //Accept the file
            cb(null, true);
        }
    })
}),
],
  controllers: [UsersController],
  providers: [UsersService, MulterService],
})
export class UsersModule {}
