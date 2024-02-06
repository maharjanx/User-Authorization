import { Controller, Get, HttpStatus, Param, ParseFilePipeBuilder, Post, Res, UploadedFile, UseInterceptors } from "@nestjs/common";
import { MulterService } from "./upload.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { Response } from 'express';
import { createReadStream } from "fs";
import { join } from "path";

@Controller('upload')
export class UploadController{
    constructor(private readonly multerService: MulterService){

    }

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile(
        new ParseFilePipeBuilder()
    .addMaxSizeValidator({
      maxSize: 1024*1024*5 //5MB
    })
    .build({
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
    }),
    ) file){
        console.log(file)
        try{
            const result = await this.multerService.handleFileUpload(file);

        return result;
        }catch(error){
            return {messate:'Failed To upload file'};
        }
    }

    @Get()
    async getAllFiles(){
        return this.multerService.getAllFiles();
    }

    @Get(':id')
    async getFileById(@Param('id')   id:number, @Res() res:Response){
        try{
            const file = await this.multerService.getFileById(id);

            res.contentType('image/jpeg');

            const fileStream = createReadStream(join(__dirname, `../../../uploads/user_photos/${file.filename}`));
            fileStream.pipe(res);
        } catch (error){
            res.status(error.status || 500).send(error.message || 'Internal Server Error')
        }
    }
}
