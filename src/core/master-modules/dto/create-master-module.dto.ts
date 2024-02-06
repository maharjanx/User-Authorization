import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateMasterModuleDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  short_name: string;

  @IsString({ message: "Description must be a string" })
  @MaxLength(255, {
    message: "Description must be at most 255 characters long",
  })
  module_description: string;
}
