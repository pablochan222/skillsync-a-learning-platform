import { Injectable, NotFoundException } from '@nestjs/common';
import { LearnerDto } from './dto/learner.dto';
import { Learner } from './learner.model';
import { v4 as uuidv4} from 'uuid';

@Injectable()
export class LearnerService {
    learners : Learner[] = [];
    async createLearner(learnerDto : LearnerDto) : Promise<Learner>{
        const {name, email, phone, password , gender, imageUrl} = learnerDto;
        const newLearner : Learner = {
            id: uuidv4(),
            name,
            email,
            phone,
            password,
            gender,
            imageUrl
        }
        this.learners.push(newLearner);
        return newLearner;
    }

    async getLearnerById(userId : string) : Promise<Learner> {
        const foundLearner = this.learners.find(learner=>learner.id===userId);
        if(!foundLearner){
            throw new NotFoundException("User Not Found");
        }
        return foundLearner;
    }

    async updateNameById(id : string , name: string) : Promise<Learner>{
        let updateableLearner : Learner = await this.getLearnerById(id);
        this.learners = this.learners.filter(learner => learner !== updateableLearner);
        updateableLearner.name = name;
        this.learners.push(updateableLearner);
        return updateableLearner;        
    }
    
    async getAllLearners() : Promise<Learner[]>{
        return this.learners;
    }

}
