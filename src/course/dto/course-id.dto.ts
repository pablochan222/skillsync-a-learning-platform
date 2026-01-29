import { IsUUID } from "class-validator";

export class CourseIdDto{
    @IsUUID('4')
    courseId : string;
}