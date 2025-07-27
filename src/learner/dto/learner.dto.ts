import { IsEmail, IsEnum, IsNotEmpty, IsNumberString, IsOptional, IsString, Length, Matches } from "class-validator";
import { LearnerGender } from "../gender-enum";
export class LearnerDto{
    id : string;

    @IsNotEmpty()
    @IsString()
    name : string;

    @IsNotEmpty()
    @IsEmail()
    @Matches(/^[\w.%+-]+@aiub\.edu$/, {
        message: 'Email must be from aiub.edu domain',
    })
    email : string;

    @IsNumberString()
    @Length(11)
    phone : number;

    @IsNotEmpty()
    @IsString()
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9\s]).{8,}$/, {
        message : 'Password must contain atleast one uppercase, one lower case, one digit and one symbol'
    })
    password : string;

    @IsEnum(LearnerGender)
    @IsOptional()
    gender? : LearnerGender;

    @IsOptional()
    @IsString()
    imageUrl? : string;
}
