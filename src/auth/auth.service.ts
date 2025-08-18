import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Learner } from 'src/learner/learner.entity';
import { Repository } from 'typeorm';
import { LoginCredentialDto } from './dto/login-credential.dto';
import * as bcrypt from 'bcrypt';
import { RolesEnum } from './roles.enum';
import { UserPayload } from './user-payload.interface';
import { LearnerService } from 'src/learner/learner.service';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from './dto/user.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Learner) private readonly learnerRepo : Repository<Learner>,
        private readonly learnerService : LearnerService,
        private readonly jwtService : JwtService
    ){}

    async createUser(){}
    
    async validateUser(loginCredentialDto : LoginCredentialDto) : Promise<UserPayload>{
        const { email, password } = loginCredentialDto;
        let user = await this.learnerService.getLearnerByEmail(email);
        let role : RolesEnum = RolesEnum.LEARNER;
        
        // if(!user){
        //     user = await this.instructorService.getInstructorByEmail(email);
        // }
        // if(!user){
        //     user = await this.adminService.getInstructorByEmail(email);
        // }

        if(user && await bcrypt.compare(password, user.password)){
            const {password, ...others} = user;
            const userPayload : UserPayload = {...others, role};
            return userPayload;
        }
        return null;
    }

    async signIn (userPayload : UserPayload) : 
    Promise<{access_token: string, expires_in : number, user: UserPayload }> {
        const payload =  {
            id : userPayload.id,
            name : userPayload.name,
            email : userPayload.email,
            role : userPayload.role,
            iss : 'SkillSync'         
        };
        return {
            access_token : this.jwtService.sign(payload),
            expires_in : 3600,
            user : userPayload
        }
    }
    

    async signUp(userDto : UserDto) : Promise<{message : string}> {
        if(userDto)
            return await this.learnerService.createLearner(userDto);
    }
}
