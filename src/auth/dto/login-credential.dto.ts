import { IsEmail, IsNotEmpty, IsString } from "class-validator";

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
}