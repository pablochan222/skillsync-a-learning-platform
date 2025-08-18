import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { UserDto } from '../auth/dto/user.dto';
import { Learner } from './learner.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserPayload } from '../auth/user-payload.interface';
import { RolesEnum } from '../auth/roles.enum';
import * as bcrypt from 'bcrypt';
import { retry } from 'rxjs';

@Injectable()
export class LearnerService {
    constructor(@InjectRepository(Learner) private readonly learnerRepo : Repository<Learner>){}

    otpgenerator(length : number) : string {
        let otp = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456780';
        for(let i =0; i<length; i++){
            otp+=characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return otp;
    }
    

    async createLearner(userDto : UserDto) : Promise<{message : string}>{
        const otp : string = this.otpgenerator(8);
        const rounds = 12;
        const {name, email, phone, password , gender, imageUrl, bio, specilization} = userDto;
        const hashed_password = await bcrypt.hash(password, rounds);
        try{
            const newLearner : Learner = this.learnerRepo.create({
                name,
                email,
                phone,
                password : hashed_password,
                gender,
                imageUrl,
                bio,
                specilization,
                otp
            });
            await this.learnerRepo.save(newLearner);
            return {message : 'User created'};
        }
        catch(error){
            console.log(error);
            if(error.code === '23505'){
                throw new ConflictException("User already exist");
            }
        }
    }

    async getLearnerById(userId : string) : Promise<UserPayload> {
        const foundLearner : Learner = await this.learnerRepo.findOneBy({id : userId});
        if(!foundLearner){
            throw new NotFoundException();
        }
        const {password, ...others} = foundLearner;
        const role = RolesEnum.LEARNER;
        const learnerPayload : UserPayload = {
            ...others,
            role
        };
        return learnerPayload;
    }

    async getLearnerByEmail(email : string) : Promise<Learner> {
        const learner = await this.learnerRepo.findOneBy({ email : email});
        if(!learner){
            throw new NotFoundException();
        }
        return learner;
    }


    async updatePhoneNumberById(id : string, phone : string) : Promise<UserPayload> {
        const foundLearner = await this.learnerRepo.findOneBy({id : id});
        if(!foundLearner){
            throw new NotFoundException();
        }
        foundLearner.phone = phone;
        try{
            await this.learnerRepo.save(foundLearner);
        }
        catch(error){
            if(error.code === '23505'){
                throw new ConflictException('Phone number already exist');
            }

        }
        return await this.getLearnerById(id);
    }


    

    async deleteLearnerById(id : string) : Promise<void> {
        const foundLearner = await this.getLearnerById(id);
        if(!foundLearner){
            throw new BadRequestException("Something went wrong");
        }
        await this.learnerRepo.delete({id : id});        
    }

    async getAllLearners() : Promise<Learner[]>{
        const learners : Learner[] = await this.learnerRepo.find();
        return learners;        
    }

    
    

    async updateNameById(id : string , name: string) : Promise<UserPayload>{
        const foundLearner = await this.learnerRepo.findOneBy({id : id});
        if(!foundLearner){
            throw new NotFoundException();
        }
        foundLearner.name = name;
        try{
            await this.learnerRepo.save(foundLearner);
        }
        catch(error){
            if(error.code === '23505'){
                throw new ConflictException('Phone number already exist');
            }

        }
        return await this.getLearnerById(id);
    }

    async updateImageById(id : string, imageUrl : string) : Promise<UserPayload> {
        const learner = await this.learnerRepo.findOne({
            where : {id}
        });
        if(!learner){
            throw new NotFoundException();
        }
        learner.imageUrl = imageUrl;
        try{
            await this.learnerRepo.save(learner);
        }
        catch(error){
            console.log(error);
        }
        return await this.getLearnerById(id);
    }

    

    

}
