import { Request, Controller, Body, Param, Get, Patch, Delete, UseGuards, UnauthorizedException, ValidationPipe, UsePipes, UseInterceptors, UploadedFile } from '@nestjs/common';
import { LearnerService } from './learner.service';
import { UserPayload } from '../auth/user-payload.interface';
import { LearnerUpdateDto } from './dto/learner-update.dto';
import { Learner } from './learner.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesEnum } from 'src/auth/roles.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, MulterError } from 'multer';

@Controller('learner')
export class LearnerController {
    constructor (private readonly learnerService : LearnerService){}
    
    @UseGuards(JwtAuthGuard)
    @Get("/profile")
    async getDetails(@Request() req) : Promise<UserPayload>{
        return await this.learnerService.getLearnerById(req.user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('/profile/phone')
    async updatePhone(@Request() req, @Body() learnerUpdateDto : LearnerUpdateDto) : Promise<UserPayload> {
        const {phone} = learnerUpdateDto;
        try{
            return await this.learnerService.updatePhoneNumberById(req.user.id, phone);
        }
        catch(error){
            console.log(error);
        }
    }

    @Delete('/:id')
    async deleteUser(@Param('id') id : string) : Promise<void> {
        await this.learnerService.deleteLearnerById(id);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getAllUsers(@Request() req) : Promise<Learner[]>{
        if(req.user.role === RolesEnum.ADMIN)
            return await this.learnerService.getAllLearners();
        else{
            throw new UnauthorizedException();
        }
    }

    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe())
    @Patch('/profile/name')
    async updateName(@Body('name') name : string, @Request() req) : Promise<UserPayload> {
        return await this.learnerService.updateNameById(req.user.id, name);
    }

    @UseGuards(JwtAuthGuard)
    @Patch("/profile/image")
    @UsePipes(new ValidationPipe())
    @UseInterceptors(FileInterceptor('image', {
        fileFilter: (req, file, cb)=>{
            if(file.originalname.match(/^.*\.(jpg|webp|png|jpeg)$/i)){
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
        return await this.learnerService.updateImageById(req.user.id, image.path);
    }



}
