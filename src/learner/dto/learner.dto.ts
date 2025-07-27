import { IsEmail, IsEnum, IsNotEmpty, IsNumberString, IsOptional, IsString, Length, Matches } from "class-validator";
import { LearnerGender } from "../gender-enum";
import { Transform } from "class-transformer";
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

    @IsNumberString({}, {
        message: 'Phone number must contain only numbers'
    })
    @Transform(({ value }) => value?.trim())
    @Length(11, 11, {
        message: 'Phone number must be exactly 11 digits'
    })
    phone : string;

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
