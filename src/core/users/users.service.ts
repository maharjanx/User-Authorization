import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { UserRole } from "../user-role/entities/user-role.entity";
import { Role } from "../role/entities/role.entity";
import path from "path";
import * as fs from 'fs/promises';
import{File} from 'multer';
import { FileEntity } from "../upload/entity/file.entity";
import { MulterService } from "../upload/upload.service";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userService: Repository<User>,
    @InjectRepository(UserRole) private userRoleService: Repository<UserRole>,
    @InjectRepository(Role) private roleService: Repository<Role>,
    @InjectRepository(FileEntity) private fileservice: Repository<FileEntity>,
    private multerService: MulterService


  ) {}

  //  METHOD TO CREATE THE NEW USER , HASH PASSWORD
  //ALSO INCLUDES ADDING ROLE BY SELECTING ITS ID IN ARRAY
  //....................................................
  async createUser(createUserDto: CreateUserDto, file:any) {
    await this.checkIfUserExist(createUserDto.email);
    await this.checkIfUserEmpCodeExist(createUserDto.emp_code);
    const  savedFile = await this.saveToFileDatabase(file);

    return this.userRoleService.manager.transaction(async (t) => {
      const genSalt = await bcrypt.genSalt(10);
      console.log(genSalt);
      const hashPassword = await bcrypt.hash(createUserDto.password, genSalt);

      const newUser = this.userService.create({
        ...createUserDto,
        password: hashPassword,
        salt: genSalt,
        file:file.filename
      });

      const savedUser = await t.save(newUser);
      for (let role of createUserDto.roleId) {
        if (role) {
          const createUserRole = this.userRoleService.create({
            userId: savedUser.id,
            roleId: role,
          });
          await t.save(createUserRole);
        } else
          throw new HttpException(
            `Role with id${role} not found`,
            HttpStatus.BAD_REQUEST
          );
      }

      

      return savedUser;
    });
  }

  private async saveToFileDatabase(file:any):Promise<FileEntity>{
    const savedFile = this.fileservice.create({
      originalname:file.originalname,
      filename:file.filename,
      path:file.path
    })

    return await this.fileservice.save(savedFile)
  }

 
  //METHODE TO CHECK IF THE USER WITH SAME EMAIL ALREADY EXIST
  //.........................................................
  private async checkIfUserExist(email: string,id?:string) {
    const existUser = await this.userService.findOne({ where: { email } });

    if (existUser && existUser.id!=id)
      throw new HttpException(
        `The User with email: ${email} already exist`,
        HttpStatus.CONFLICT
      );
  }
  //METHODE TO CHECK IF THE USER WITH SAME emp_code ALREADY EXIST
  //.........................................................
  private async checkIfUserEmpCodeExist(emp_code: string,id?:string) {
    const existUser = await this.userService.findOne({ where: { emp_code } });

    if (existUser && existUser?.id!=id)
      throw new HttpException(
        `The User with employee Code: ${emp_code} already exist`,
        HttpStatus.CONFLICT
      );
  }

  //METHOD TO FETCH ALL USERS FROM DATABASE
  //..............................................

  async findAll() {
    const users = await this.userService.manager
      .query(`
      SELECT u.id, u.full_name, u.email, u.phone, u.address, u.emp_code,
case
 when u.file is null 
 then null
 else
concat(coalesce(null,'http://localhost:3001/user_photos/'),u.file)
end as link
,
    CASE
     WHEN COUNT (r.id)>0 Then
     json_agg(
     json_build_object(
     'id',r.id,
     'name',r.name
     ))
     Else
     NULL 
     END AS roles
     from users u
     left join user_roles ur on ur."userId" = u.id
     left join roles r on ur."roleId" = r.id
     group by u.id, u.full_name, u.email, u.phone, u.address,u.emp_code, u.file
      `);

    return users;
  }

  async findOneUser(id: string) {
    try {
      const existUser = await this.userService.findOne({ where: { id } });

      if (!existUser)
        throw new HttpException(
          `The User with id: ${id} not found.`,
          HttpStatus.NOT_FOUND
        );

      const [user] = await this.userService.manager.query(
        `SELECT u.id, u.full_name, u.email, u.phone, u.address, u.emp_code, u.file,
    CASE
     WHEN COUNT (r.id)>0 Then
     json_agg(
     json_build_object(
     'id',r.id,
     'name',r.name
     ))
     Else
     NULL 
     END AS roles
     from users u
     left join user_roles ur on ur."userId" = u.id
     left join roles r on ur."roleId" = r.id
     WHERE
     u.id = $1
     group by u.id, u.full_name, u.email, u.phone, u.address,u.emp_code, u.file;
     `,
        [id]
      );

      return user;
    } catch (error) {
      console.error("Error in findOneUser", error);
      throw new HttpException(
        "Internal Server Error",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    try {
      return await this.userService.manager.transaction(async (t) => {
        // Update user details
        await this.checkIfUserExist(updateUserDto.email,id);
        await this.checkIfUserEmpCodeExist(updateUserDto.emp_code,id);
        const existUser = await this.userService.findOne({ where: { id } });

        if (!existUser) {
          throw new HttpException(
            `The User with id: ${id} not found.`,
            HttpStatus.NOT_FOUND
          );
        }

        const { roleId, photo, ...rest } = updateUserDto;
        await this.userService.update(id, rest); // Assuming you have an update method in your userService

        //update photo
        

        // Update user roles
        const alreadyExistingRoleIds = (
          await this.userRoleService.find({
            where: { userId: id },
          })
        ).map((relation) => relation.roleId);

        const newRoleIds = updateUserDto.roleId;

        const rolesToDelete = alreadyExistingRoleIds.filter(
          (roleId) => !newRoleIds.includes(roleId)
        );
        const rolesToAdd = newRoleIds.filter(
          (roleId) => !alreadyExistingRoleIds.includes(roleId)
        );

        for (const roleIdToDelete of rolesToDelete) {
          const userRole = await this.userRoleService.findOne({
            where: { userId: id, roleId: roleIdToDelete },
          });

          if (userRole) {
            await t.remove(UserRole, userRole);
          }
        }

        for (const roleIdToAdd of rolesToAdd) {
          const roleExists = await this.roleService.count({
            where: { id: roleIdToAdd },
          });

          if (roleExists === 0) {
            throw new NotFoundException(
              `Role with Id ${roleIdToAdd} not found`
            );
          }

          const userRole = this.userRoleService.create({
            userId: id,
            roleId: roleIdToAdd,
          });
          await t.save(userRole);
        }
        return { msg: "User Updated!!!" };
      });
    } catch (error) {
      console.error(error);
      throw new HttpException(
        "Internal Server Error",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
  ////TO DELETE THE USER ALONG WITH ITS ROLE
  async remove(id: string) {
    const existUser = await this.userService.findOne({ where: { id } });

    if (!existUser) {
      throw new HttpException("User Not Found!!!", HttpStatus.NOT_FOUND);
    }

    return await this.userService.manager.transaction(async (t) => {
      //Delete the relation in the junction table
      await t.delete(UserRole, { userId: id });

      //delete the User

      await t.remove(User, existUser);
      return { msg: "User deleted successfully!!!" };
    });
  }
}
