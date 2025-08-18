import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { RolesEnum } from "../roles.enum";

export class LoginCredentialDto{
    @IsNotEmpty()
    @IsString()
    @IsEmail({}, {
        message : "Valid email address required"
    })
    email :  string;

    @IsNotEmpty()
    @IsString()
    password : string;

    @IsEnum(RolesEnum, {message : "Role must be either learner or instructor"})
    @IsOptional()
    role?: RolesEnum;    
}