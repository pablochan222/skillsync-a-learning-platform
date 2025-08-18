import { Request, Controller, Body, Param, Get, Patch, Delete, UseGuards, UnauthorizedException, ValidationPipe, UsePipes, UseInterceptors, UploadedFile } from '@nestjs/common';
import { InstructorService } from './instructor.service';
import { UserPayload } from '../auth/user-payload.interface'
import { InstructorUpdateDto } from './dto/instructor-update.dto';
import { Instructor } from './instructor.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesEnum } from 'src/auth/roles.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, MulterError } from 'multer';

@Controller('instructor')
export class InstructorController {
    constructor (private readonly instructorService : InstructorService){}
    
    @UseGuards(JwtAuthGuard)
    @Get("/profile")
    async getDetails(@Request() req) : Promise<UserPayload>{
        return await this.instructorService.getInstructorById(req.user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('/profile/phone')
    async updatePhone(@Request() req, @Body() instructorUpdateDto : InstructorUpdateDto) : Promise<UserPayload> {
        const {phone} = instructorUpdateDto;
        try{
            return await this.instructorService.updatePhoneNumberById(req.user.id, phone);
        }
        catch(error){
            console.log(error);
        }
    }

    @Delete('/:id')
    async deleteUser(@Param('id') id : string) : Promise<void> {
        await this.instructorService.deleteInstructorById(id);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getAllUsers(@Request() req) : Promise<Instructor[]>{
        if(req.user.role === RolesEnum.ADMIN)
            return await this.instructorService.getAllInstructors();
        else{
            throw new UnauthorizedException();
        }
    }

    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe())
    @Patch('/profile/name')
    async updateName(@Body('name') name : string, @Request() req) : Promise<UserPayload> {
        return await this.instructorService.updateNameById(req.user.id, name);
    }

    @UseGuards(JwtAuthGuard)
    @Patch("/profile/image")
    @UsePipes(new ValidationPipe())
    @UseInterceptors(FileInterceptor('image', {
        fileFilter: (req, file, cb)=>{
            if(/^.*\.(jpg|webp|png|jpeg)$/i.exec(file.originalname)){
                cb(null,  true);
            }
            else{
                cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'Only images are allowed'), false);
            }
        },
        limits: {fileSize : 2000000},
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, cb)=> {
                cb(null, Date.now()+file.originalname);
            }
        })        
    }))
    async updateImage(@Request() req ,  @UploadedFile() image: Express.Multer.File){
        return await this.instructorService.updateImageById(req.user.id, image.path);
    }



}
