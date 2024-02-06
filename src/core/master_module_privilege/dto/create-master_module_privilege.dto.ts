import { IsArray, IsNotEmpty, IsString } from "class-validator";

export enum Method {
  GET = "get",
  POST = "post",
  DELETE = "delete",
  PUT = "put",
  PATCH = "patch",
}
export class CreateMasterModulePrivilegeDto {
  master_screen_id: string;

  @IsString()
  moduleShortName: string;

  @IsString()
  moduleName: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsArray()
  privileges: {
    privilegeId: string;
    method: Method;
    url: string;
  }[];
}
