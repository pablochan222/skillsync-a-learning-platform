import { IsEmail, IsEnum, IsNotEmpty, IsNumberString, IsOptional, IsString, Length, Matches } from "class-validator";
import { GenderEnum } from "../../common/gender-enum";
import { Transform } from "class-transformer";
export class LearnerUpdateDto{
    @IsOptional()
    id : string;

    @IsNotEmpty()
    @IsString()
    @IsOptional()
    name : string;

    @IsOptional()
    @IsNotEmpty()
    @IsEmail()
    @Matches(/^[\w.%+-]+@aiub\.edu$/, {
        message: 'Email must be from aiub.edu domain',
    })
    email : string;

    @IsOptional()
    @IsNumberString({}, {
        message: 'Phone number must contain only numbers'
    })
    @Transform(({ value }) => value?.trim())
    @Length(11, 11, {
        message: 'Phone number must be exactly 11 digits'
    })
    @Matches(/^(01|09)\d{9}$/, {
        message: 'Phone number must start with 01 or 09 and be 11 digits long',
    })
    phone : string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9\s]).{8,}$/, {
        message : 'Password must contain atleast one uppercase, one lower case, one digit, one symbol and it must be at least 8 digit'
    })
    password : string;

    @IsEnum(GenderEnum, {message : "Gender Male or female"})
    @IsOptional()
    gender? : GenderEnum;

    @IsOptional()
    @IsString()
    imageUrl? : string;
}
