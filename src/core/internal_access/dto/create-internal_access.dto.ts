import { IsArray, IsEnum, IsNotEmpty, IsString, isEnum, isString } from "class-validator";

export enum Action {
  DELETE = "delete",
  CREATE = "create",
}

  

export class CreateInternalAccessDto {
  @IsNotEmpty()
  @IsString()
  roleId: string;
  
  @IsNotEmpty()
  @IsString()
  moduleId: string

  @IsEnum({message:'Action must be either "delete" or "create"...'})
  action: Action;

  @IsArray()
  privilegeId:string;


}



  //   @IsArray()
//   module: {
//     master_module_privilege_id: string;
//     action: Action;
//   };

//   @IsNotEmpty()
//   @IsString()
//   moduleId:string;

//   @IsNotEmpty()
//   @IsString()
//   privilegeId: string;
// }
