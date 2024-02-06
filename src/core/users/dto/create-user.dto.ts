import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
} from "class-validator";

export class CreateUserDto {
  @IsNotEmpty()
  @Length(1, 100)
  @ApiProperty()
  full_name: string;

  @IsNotEmpty()
  @IsEmail()
  @Length(1, 255)
  email: string;

  @IsOptional()
  @IsPhoneNumber("NP", { message: "Invalid phone number" })
  phone: string;

  @IsOptional()
  @Length(1, 255)
  address: string;

  @IsString()
  @IsNotEmpty()
  emp_code: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsOptional()
  password_change: string;

  @IsString()
  @IsOptional()
  salt: string;

  @IsOptional()
  readonly photo?: File;

  roleId: string[];
}
