import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { UserDto } from '../auth/dto/user.dto';
import { Instructor } from './instructor.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserPayload } from '../auth/user-payload.interface';
import { RolesEnum } from '../auth/roles.enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class InstructorService {
    constructor(@InjectRepository(Instructor) private readonly instructorRepo : Repository<Instructor>){}

    otpgenerator(length : number) : string {
        let otp = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456780';
        for(let i =0; i<length; i++){
            otp+=characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return otp;
    }
    

    async createInstructor(userDto : UserDto) : Promise<{message : string}>{
        const otp : string = this.otpgenerator(8);
        const rounds = 12;
        const {name, email, phone, password , gender, imageUrl, bio, specilization} = userDto;
        const hashed_password = await bcrypt.hash(password, rounds);
        try{
            const newInstructor : Instructor = this.instructorRepo.create({
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
            await this.instructorRepo.save(newInstructor);
            return {message : 'User created'};
        }
        catch(error){
            console.log(error);
            if(error.code === '23505'){
                throw new ConflictException("User already exist");
            }
        }
    }

    async getInstructorById(userId : string) : Promise<UserPayload> {
        const foundInstructor : Instructor = await this.instructorRepo.findOneBy({id : userId});
        if(!foundInstructor){
            throw new NotFoundException();
        }
        const {password, ...others} = foundInstructor;
        const role = RolesEnum.INSTRUCTOR;
        const instructorPayload : UserPayload = {
            ...others,
            role
        };
        return instructorPayload;
    }

    async getInstructorByEmail(email : string) : Promise<Instructor> {
        const instructor = await this.instructorRepo.findOneBy({ email : email});
        if(!instructor){
            throw new NotFoundException();
        }
        return instructor;
    }


    async updatePhoneNumberById(id : string, phone : string) : Promise<UserPayload> {
        const foundInstructor = await this.instructorRepo.findOneBy({id : id});
        if(!foundInstructor){
            throw new NotFoundException();
        }
        foundInstructor.phone = phone;
        try{
            await this.instructorRepo.save(foundInstructor);
        }
        catch(error){
            if(error.code === '23505'){
                throw new ConflictException('Phone number already exist');
            }

        }
        return await this.getInstructorById(id);
    }


    

    async deleteInstructorById(id : string) : Promise<void> {
        const foundInstructor = await this.getInstructorById(id);
        if(!foundInstructor){
            throw new BadRequestException("Something went wrong");
        }
        await this.instructorRepo.delete({id : id});        
    }

    async getAllInstructors() : Promise<Instructor[]>{
        const instructors : Instructor[] = await this.instructorRepo.find();
        return instructors;        
    }

    
    

    async updateNameById(id : string , name: string) : Promise<UserPayload>{
        const foundInstructor = await this.instructorRepo.findOneBy({id : id});
        if(!foundInstructor){
            throw new NotFoundException();
        }
        foundInstructor.name = name;
        try{
            await this.instructorRepo.save(foundInstructor);
        }
        catch(error){
            if(error.code === '23505'){
                throw new ConflictException('Phone number already exist');
            }

        }
        return await this.getInstructorById(id);
    }

    async updateImageById(id : string, imageUrl : string) : Promise<UserPayload> {
        const instructor = await this.instructorRepo.findOne({
            where : {id}
        });
        if(!instructor){
            throw new NotFoundException();
        }
        instructor.imageUrl = imageUrl;
        try{
            await this.instructorRepo.save(instructor);
        }
        catch(error){
            console.log(error);
        }
        return await this.getInstructorById(id);
    }

    

    

}
