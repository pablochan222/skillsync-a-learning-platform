import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Learner } from 'src/learner/learner.entity';
import { Instructor } from 'src/instructor/instructor.entity';
import { Repository } from 'typeorm';
import { LoginCredentialDto } from './dto/login-credential.dto';
import * as bcrypt from 'bcrypt';
import { RolesEnum } from './roles.enum';
import { UserPayload } from './user-payload.interface';
import { LearnerService } from 'src/learner/learner.service';
import { InstructorService } from 'src/instructor/instructor.service';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from './dto/user.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Learner) private readonly learnerRepo : Repository<Learner>,
        @InjectRepository(Instructor) private readonly instructorRepo : Repository<Instructor>,
        private readonly learnerService : LearnerService,
        private readonly instructorService : InstructorService,
        private readonly jwtService : JwtService
    ){}

    
    async validateUser(loginCredentialDto : LoginCredentialDto) : Promise<UserPayload>{
        const { email, password, role } = loginCredentialDto;
        let user;
        let userRole : RolesEnum;
        
        if (role === RolesEnum.LEARNER || !role)  {
            try {
                user = await this.learnerService.getLearnerByEmail(email);
                userRole = RolesEnum.LEARNER;
            } catch {
                return null;
            }
        } else if (role === RolesEnum.INSTRUCTOR) {
            try {
                user = await this.instructorService.getInstructorByEmail(email);
                userRole = RolesEnum.INSTRUCTOR;
            } catch {
                return null;
            }
        }
        else if (role === RolesEnum.ADMIN) {
            //admin logic
        }
        

        if(user && await bcrypt.compare(password, user.password)){
            const {password, ...others} = user;
            const userPayload : UserPayload = {...others, role: userRole};
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
        if (userDto.role === RolesEnum.LEARNER || !userDto.role) {
            return await this.learnerService.createLearner(userDto);
        } else if (userDto.role === RolesEnum.INSTRUCTOR) {
            return await this.instructorService.createInstructor(userDto); // Type assertion needed for gender compatibility
        } else {
            throw new Error('Invalid role specified');
        }
    }
}
