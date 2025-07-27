import { Controller, Post, Body, UseInterceptors, UploadedFile, UsePipes, ValidationPipe } from '@nestjs/common';
import { LearnerService } from './learner.service';
import { LearnerDto } from './dto/learner.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, MulterError } from 'multer';
import { v4 as uuidv4 } from 'uuid';

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
                cb(new MulterError('LIMIT_UNEXPECTED_FILE'), false);
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
    async signUp(@Body() learnerDto : LearnerDto, @UploadedFile() image: Express.Multer.File) : Promise<{message: string , data : LearnerDto}> {
        learnerDto.id = uuidv4();
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
}
