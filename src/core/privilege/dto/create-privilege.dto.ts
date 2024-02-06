import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreatePrivilegeDto {
  @IsNotEmpty()
  @MaxLength(20, { message: "name cannot be longer than 20 character" })
  name: string;

  @IsNotEmpty()
  @MaxLength(15, { message: "short_name cannot be longer than 20 character" })
  short_name: string;

  @IsString()
  description: string;
}
