import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateEnrollmentDto {
    @IsNotEmpty()
    @IsUUID()
    courseId: string;

    @IsNotEmpty()
    @IsUUID()
    learnerId: string;
}
