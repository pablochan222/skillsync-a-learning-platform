import { Injectable, NotFoundException, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './course.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CourseStatus } from './course-status.enum';
import { InstructorService } from 'src/instructor/instructor.service';
import { RolesEnum } from 'src/auth/roles.enum';

@Injectable()
export class CourseService {
    constructor(
        @InjectRepository(Course)
        private readonly courseRepository: Repository<Course>,
        private readonly instructorService : InstructorService
    ) {}

    async create(createCourseDto: CreateCourseDto, instructorId: string): Promise<Course> {
        const course = this.courseRepository.create({
            ...createCourseDto,
            instructorId,
            status: createCourseDto.status || CourseStatus.DRAFT,
        });

        return await this.courseRepository.save(course);
    }

    async findAll(): Promise<Course[]> {
        return await this.courseRepository.find();
    }

    async findAllByInstructor(instructorId: string): Promise<Course[]> {
        return await this.courseRepository.find({
            where: { instructorId },
        });
    }

    async findOne(id: string): Promise<Course> {
        const course = await this.courseRepository.findOne({
            where: { id },
            relations: ['instructor', 'enrollments', 'enrollments.learner'],
        });

        if (!course) {
            throw new NotFoundException(`Course with ID ${id} not found`);
        }

        return course;
    }

    async update(id: string, updateCourseDto: UpdateCourseDto, instructorId: string): Promise<Course> {
        const course = await this.findOne(id);

        if (course.instructorId !== instructorId) {
            throw new ForbiddenException('You can only update your own courses');
        }

        await this.courseRepository.update(id, updateCourseDto);
        return await this.findOne(id);
    }

    async remove(id: string, instructorId: string): Promise<void> {
        const course = await this.findOne(id);

        if (course.instructorId !== instructorId) {
            throw new ForbiddenException('You can only delete your own courses');
        }

        await this.courseRepository.delete(id);
    }

    async findApprovedCourses(): Promise<Course[]> {
        return await this.courseRepository.find({
            where: { status: CourseStatus.APPROVED },
        });
    }

    async findAllWithInstructor(): Promise<Course[]> {
        return await this.courseRepository.find({
            relations: ['instructor'],
        });
    }

    async updateStatus(id: string, status: CourseStatus): Promise<Course> {
        await this.findOne(id);
        await this.courseRepository.update(id, { status });
        return await this.findOne(id);
    }

    async getInstructorFromCourse(id : string){
        const course = await this.courseRepository.findOneBy({ id: id });
        if (!course) {
            throw new NotFoundException('Course Not Found');
        }
        
        const instructor = await this.instructorService.getInstructorById(course.instructorId);
        return { instructor: instructor };

    }

    async addCoursesAsFeatured(courses : string[], user : any){
        if(user && user.role === RolesEnum.INSTRUCTOR){
            let result : any[] = [];
            for(const courseId of courses){
                const course = await this.findOne(courseId);
                if(course){
                    if(course.isFeatured === true){
                        result.push({message : `Course ${courseId} already in featured.`});
                    }
                    else{
                        course.isFeatured = true;
                        this.courseRepository.save(course);
                        result.push({message : `Course ${courseId} added as featured.`});
                    }
                }
                else{
                    result.push({message : `Error course ${courseId} not found`});
                }
            }
            return result;          
        }
        else{
            throw new UnauthorizedException('You dont have the access privilage');
        }
    }

    async getFeaturedCourses(){
        const courses = await this.courseRepository.find({where:{isFeatured:true}});
        if(courses){
            return courses;
        }
        else{
            throw new UnauthorizedException('Featured courses not found');
        }
    }
}
