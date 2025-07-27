import { Controller, Post, Body, UseInterceptors, UploadedFile, UsePipes, ValidationPipe, Param, Get, Patch } from '@nestjs/common';
import { LearnerService } from './learner.service';
import { LearnerDto } from './dto/learner.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, MulterError } from 'multer';
import { Learner } from './learner.model';

@Controller('learner')
export class LearnerController {
    constructor (private readonly learnerService : LearnerService){}

    @Post('/signup')
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
    @UsePipes(new ValidationPipe())
    async signUp(@Body() learnerDto : LearnerDto, @UploadedFile() image: Express.Multer.File) : Promise<{message: string , data : Learner}> {
        if(!image){
            learnerDto.imageUrl = "";
        }
        else{
            learnerDto.imageUrl = image.path;
        }
        return {
            message : "Learner Created",
            data: await this.learnerService.createLearner(learnerDto)
        }
    }

    @Get("/:id")
    async getDetails(@Param('id') id : string) : Promise<Learner>{
        return await this.learnerService.getLearnerById(id);
    }

    @Patch()
    async updateName(@Body() learnerDto : LearnerDto) : Promise<Learner> {
        const {id , name} = learnerDto;
        return await this.learnerService.updateNameById(id, name);
    }

    @Get()
    async getAllLearners() : Promise<Learner[]>{
        return await this.learnerService.getAllLearners();
    }



}
