import { IsEnum, IsOptional, IsNumber, IsString, Min } from 'class-validator';
import { CourseStatus } from '../course-status.enum';

export class UpdateCourseDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    price?: number;

    @IsOptional()
    @IsEnum(CourseStatus)
    status?: CourseStatus;
}
