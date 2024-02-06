import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateRoleDto {
  @IsNotEmpty()
  @MaxLength(20, { message: "name cannot be longer than 20 character" })
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
