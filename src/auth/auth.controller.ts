import { Controller, Post, UseGuards, Request, UseInterceptors, Body, UploadedFile, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterError, diskStorage } from 'multer';
import { UserDto } from 'src/auth/dto/user.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService : AuthService,
    ){}
    @UseGuards(LocalAuthGuard)
    @Post('/login')
    async signIn(@Request() req){
        return await this.authService.signIn(req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Post('/test')
    async test(@Request() req){
        console.log(req);
    }

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
        async signUp(@Body() userDto : UserDto, @UploadedFile() image: Express.Multer.File) : Promise<{message: string}> {
            if(image){
                userDto.imageUrl = image.path;
            }
            return await this.authService.signUp(userDto);
        }
}
