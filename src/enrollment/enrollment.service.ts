import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enrollment } from './enrollment.entity';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { Course } from '../course/course.entity';
import { Learner } from '../learner/learner.entity';

@Injectable()
export class EnrollmentService {
    constructor(
        @InjectRepository(Enrollment)
        private readonly enrollmentRepository: Repository<Enrollment>,
        @InjectRepository(Course)
        private readonly courseRepository: Repository<Course>,
        @InjectRepository(Learner)
        private readonly learnerRepository: Repository<Learner>,
    ) {}

    async create(createEnrollmentDto: CreateEnrollmentDto): Promise<Enrollment> {
        const { courseId, learnerId } = createEnrollmentDto;

        const course = await this.courseRepository.findOne({
            where: { id: courseId },
        });
        if (!course) {
            throw new NotFoundException(`Course with ID ${courseId} not found`);
        }

        const learner = await this.learnerRepository.findOne({
            where: { id: learnerId },
        });
        if (!learner) {
            throw new NotFoundException(`Learner with ID ${learnerId} not found`);
        }

        const existingEnrollment = await this.enrollmentRepository.findOne({
            where: { courseId, learnerId },
        });
        if (existingEnrollment) {
            throw new ConflictException('Learner is already enrolled in this course');
        }

        const enrollment = this.enrollmentRepository.create({
            courseId,
            learnerId,
            enrolled_at: new Date(),
        });

        return await this.enrollmentRepository.save(enrollment);
    }

    async findAll(): Promise<Enrollment[]> {
        return await this.enrollmentRepository.find({
            //relations: ['course', 'learner'],
        });
    }

    async findByCourse(courseId: string): Promise<Enrollment[]> {
        return await this.enrollmentRepository.find({
            where: { courseId },
            //relations: ['learner'],
        });
    }

    async findByLearner(learnerId: string): Promise<Enrollment[]> {
        return await this.enrollmentRepository.find({
            where: { learnerId },
            //relations: ['course', 'course.instructor'],
        });
    }

    async findOne(id: string): Promise<Enrollment> {
        const enrollment = await this.enrollmentRepository.findOne({
            where: { id },
            //relations: ['course', 'learner'],
        });

        if (!enrollment) {
            throw new NotFoundException(`Enrollment with ID ${id} not found`);
        }

        return enrollment;
    }

    async remove(id: string): Promise<void> {
        await this.findOne(id);
        await this.enrollmentRepository.delete(id);
    }

    async removeByLearnerAndCourse(learnerId: string, courseId: string): Promise<void> {
        const enrollment = await this.enrollmentRepository.findOne({
            where: { learnerId, courseId },
        });

        if (!enrollment) {
            throw new NotFoundException('Enrollment not found');
        }

        await this.enrollmentRepository.delete(enrollment.id);
    }
}
