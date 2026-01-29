import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    UseGuards,
    Request,
    ParseUUIDPipe,
} from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('enrollments')
export class EnrollmentController {
    constructor(private readonly enrollmentService: EnrollmentService) {}

    @Post()
    @UseGuards(JwtAuthGuard)
    create(@Body() createEnrollmentDto: CreateEnrollmentDto) {
        return this.enrollmentService.create(createEnrollmentDto);
    }

    @Post('enroll/:courseId')
    @UseGuards(JwtAuthGuard)
    enroll(@Param('courseId', ParseUUIDPipe) courseId: string, @Request() req) {
        const createEnrollmentDto: CreateEnrollmentDto = {
            courseId,
            learnerId: req.user.id,
        };
        return this.enrollmentService.create(createEnrollmentDto);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    findAll() {
        return this.enrollmentService.findAll();
    }

    @Get('my-enrollments')
    @UseGuards(JwtAuthGuard)
    findMyEnrollments(@Request() req) {
        return this.enrollmentService.findByLearner(req.user.id);
    }

    @Get('course/:courseId')
    @UseGuards(JwtAuthGuard)
    findByCourse(@Param('courseId', ParseUUIDPipe) courseId: string) {
        return this.enrollmentService.findByCourse(courseId);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.enrollmentService.findOne(id);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.enrollmentService.remove(id);
    }

    @Delete('unenroll/:courseId')
    @UseGuards(JwtAuthGuard)
    unenroll(@Param('courseId', ParseUUIDPipe) courseId: string, @Request() req) {
        return this.enrollmentService.removeByLearnerAndCourse(req.user.id, courseId);
    }
}
