import {  IsArray, IsUUID } from "class-validator";

export class FeaturedCoursesDto{
    @IsArray()
    @IsUUID('4', { each: true })
    courseIds: string[];
}
