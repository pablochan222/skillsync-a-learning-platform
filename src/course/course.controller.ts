import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Request,
    ParseUUIDPipe,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CourseStatus } from './course-status.enum';
import { features } from 'process';
import { FeaturedCoursesDto } from './dto/featured-courses.dto';

@Controller('courses')
export class CourseController {
    constructor(private readonly courseService: CourseService) {}

    @Post()
    @UseGuards(JwtAuthGuard)
    create(@Body() createCourseDto: CreateCourseDto, @Request() req) {
        return this.courseService.create(createCourseDto, req.user.id);
    }

    @Get()
    findAll() {
        return this.courseService.findAll();
    }

    @Get('with-instructor')
    findAllWithInstructor() {
        return this.courseService.findAllWithInstructor();
    }

    @Get('approved')
    findApprovedCourses() {
        return this.courseService.findApprovedCourses();
    }

    @Get('my-courses')
    @UseGuards(JwtAuthGuard)
    findMyCourses(@Request() req) {
        return this.courseService.findAllByInstructor(req.user.id);
    }

    @Get('featured')
    async getFeatured() {
        return await this.courseService.getFeaturedCourses();
    }


    @Get(':id')
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.courseService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateCourseDto: UpdateCourseDto,
        @Request() req,
    ) {
        return this.courseService.update(id, updateCourseDto, req.user.id);
    }

    @Patch(':id/status')
    @UseGuards(JwtAuthGuard)
    updateStatus(
        @Param('id', ParseUUIDPipe) id: string,
        @Body('status') status: CourseStatus,
    ) {
        return this.courseService.updateStatus(id, status);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    remove(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
        return this.courseService.remove(id, req.user.id);
    }

    
    @Post('featured')
    @UsePipes(new ValidationPipe())
    @UseGuards(JwtAuthGuard)
    async addFeatured(@Body() featuredCoursesDto : FeaturedCoursesDto, @Request() req){
        return await this.courseService.addCoursesAsFeatured(featuredCoursesDto.courseIds, req.user);
    }


    @Get(':id/instructor')
    async getInstructorId(@Param('id') id : string){
        return await this.courseService.getInstructorFromCourse(id);
    }
}
