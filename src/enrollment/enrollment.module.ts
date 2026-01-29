import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnrollmentService } from './enrollment.service';
import { EnrollmentController } from './enrollment.controller';
import { Enrollment } from './enrollment.entity';
import { Course } from '../course/course.entity';
import { Learner } from '../learner/learner.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Enrollment, Course, Learner])],
    controllers: [EnrollmentController],
    providers: [EnrollmentService],
    exports: [EnrollmentService],
})
export class EnrollmentModule {}
